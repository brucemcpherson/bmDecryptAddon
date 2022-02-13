var Server = (() => {

  const PROP_PREFIX = "bda_"
  /**
   * get encrypted columns in active sheet
   */
  const _getEncryptedColumns = ({ sheet }) => bmCrypter.newDecrypter().unraveller({ sheet, complain: false })

  const clearProps = () => _getPropertyService()
    .getKeys()
    .filter(f=>f.slice(0,PROP_PREFIX.length)===PROP_PREFIX)
    .map(f=>f._getPropertyService().deleteProperty(f))
  
  /**
   * get private keys from user properties 
   */
    // local functions
  const _isUndef = (value) => typeof value === typeof undefined
  const _isNull = (value) => value === null
  const _isNundef = (value) => _isUndef(value) || _isNull(value)
  const _isObject = (value) => Object(value) === value
  const _isDate = (value) => (value instanceof Date)
  const _getPropertyService = () => PropertiesService.getUserProperties()
  const _getKeyFromProperties = (column) => _getPropertyService().getProperty(_digestColumn(column))
  const _setKeyInProperties = (column, value) => _getPropertyService().setProperty(_digestColumn(column), value)
  const _removeKeyFromProperties = (column) => _getPropertyService().deleteProperty(_digestColumn(column))
  const _digestColumn = (column) =>  PROP_PREFIX + _digest(column.id, column.columnName, column.sheetName)

  const _digest = (...args) => {
    // convert args to an array and digest them
    return Utilities.base64EncodeWebSafe(
      Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_1, args.map(d => {
        return _isObject(d) ? (_isDate(d) ? d.getTime() : JSON.stringify(d)) : (_isNundef(d) ? '_nundef_' : d.toString());
      }).join("-"), Utilities.Charset.UTF_8));
  }
  /**
   * get all the encrypted columns in everysheet
   */
  const _getAllEncryptedColumns = ({ spreadsheet }) => {
    return spreadsheet.getSheets().map(sheet => ({
      encryptedColumns: _getEncryptedColumns({ sheet }),
      spec: {
        sheetName: sheet.getName(),
        id: spreadsheet.getId(),
        sheetId: sheet.getSheetId(),
        spreadsheetName: spreadsheet.getName()
      }
    })).filter(f => f.encryptedColumns.length)
  }

  /**
   * get spreadsheet from spec
   */
  const _getSpreadsheet = (spec) => !spec ? SpreadsheetApp.getActiveSpreadsheet() : SpreadsheetApp.openById(spec.id)

  /**
   * decrypt
   */
  const decrypt = ({ encryptedSelection = [], removeEncrypted = true, testOnly = false, returnData = false, rememberKeys = true } = {}) => {
    const decrypter = bmCrypter.newDecrypter()
    const fiddlers = decrypter.exec({
      settings: encryptedSelection,
      removeEncrypted
    })

    if (!testOnly) {

      // now we can update the data
      fiddlers.forEach(fiddler => {
        decrypter.repairMetaData({ fiddler })
        fiddler.dumpValues()
      })
    }

    // for next time
    if (rememberKeys && (testOnly || !removeEncrypted)) {
      encryptedSelection.forEach (f=>_setKeyInProperties(f,f.privateKey))
    } else if (!testOnly) {
      // delete remembered keys
       encryptedSelection.forEach (f=>_removeKeyFromProperties(f))
    }
    
    const vs = fiddlers.map(f => ({
      sheetName: f.getSheet().getName(),
      id: f.getSheet().getParent().getId(),
      spreadsheetName: f.getSheet().getParent().getName(),
      data: f.getData()
    }));

    const vt = {
      encryptedSelection,
      testOnly,
      returnData,
      removeEncrypted,
      rememberKeys
    };
    
    const value = {
      content: returnData && !testOnly ? vs: null,
      ...vt,
      activeSpec: vs.length ? getActiveSpec({id: vs[0].id}) : []
    }
    console.log(value)
    return value
  }

  /**
   * getActiveSpec
   */
  const getActiveSpec = (spec) => {
    const sheets = _getAllEncryptedColumns({ spreadsheet: _getSpreadsheet(spec) })

    return sheets.reduce((p, sheet) => {
      sheet.encryptedColumns.forEach(column => { 
        const s = {
          ...sheet.spec,
          columnName: column.value,
        }
        console.log(s,_getKeyFromProperties (s), _digestColumn(s))
        p.push({
          ...s,
          privateKey: _getKeyFromProperties (s) || ''
        })
      })
      return p;
    }, [])
  }
  return {
    getActiveSpec,
    decrypt,
    getAllEncryptedColumns: (spec) => _getAllEncryptedColumns({ spreadsheet: _getSpreadsheet(spec) }),
    clearProps
  }


})()
