
  // what we get back from the client side should be a filtered version of the settings
  const settings = [
	{
		"id": "1lNLIpJwvz_GllYnloVBX02vOomZ68cP4Y2KZoPyi7Gg",
		"sheetName": "encrypted-Billionaires",
		"columnName": "Billions",
		"privateKey": "313e3e5b4b2632423b98a9bdc5b0b7fb91f3ab03cbdcf8df54163d5d5c713edf"
	},
	{
		"id": "1lNLIpJwvz_GllYnloVBX02vOomZ68cP4Y2KZoPyi7Gg",
		"sheetName": "encrypted-Billionaires",
		"columnName": "Age",
		"privateKey": "8fcc2c4eaeda5ada3933d23a300f3b303cb664b65c9667ef2b7cdb5770019248"
	},
	{
		"id": "1lNLIpJwvz_GllYnloVBX02vOomZ68cP4Y2KZoPyi7Gg",
		"sheetName": "caps",
		"columnName": "Cap Billions",
		"privateKey": "cap password"
	}
]
const clearProps = () => Server.clearProps()

function myFunction() {
  // test expose run

  const unravelled = exposeRun("Server", "getAllEncryptedColumns", { id: "1lNLIpJwvz_GllYnloVBX02vOomZ68cP4Y2KZoPyi7Gg" })
  console.log(unravelled)


  exposeRun("Server", "decrypt", {
    encryptedSelection: Selection.getEncryptedSelection({ id: "1lNLIpJwvz_GllYnloVBX02vOomZ68cP4Y2KZoPyi7Gg" }),
    removeEncrypted: false,
    testOnly: false,
    returnData: false
  })

}

function t() {
  console.log(JSON.stringify(exposeRun("Server", "getActiveSpec", { id: "1lNLIpJwvz_GllYnloVBX02vOomZ68cP4Y2KZoPyi7Gg" })))
}
// render client side data
const Selection = (() => {


  const getEncryptedSelection = (spec) => {
    return getEncryptedColumnNames().map(e => ({
      ...e
    }))
  }

  const getEncryptedColumnNames = () => {
    return settings
  }

  return {
    getEncryptedSelection
  }
})()
