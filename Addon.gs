/**
 * Adds a custom menu with items to show the sidebar and dialog.
 *
 * @param {Object} e The event parameter for a simple onOpen trigger.
 */
function onOpen(e) {
  SpreadsheetApp.getUi()
    .createAddonMenu()
    .addItem('bm Decrypter', 'showTemplate')
    .addToUi();
}

/**
 * Runs when the add-on is installed; calls onOpen() to ensure menu creation and
 * any other initializion work is done immediately.
 *
 * @param {Object} e The event parameter for a simple onInstall trigger.
 */
function onInstall(e) {
  onOpen(e);
}


/**
 * Opens a sidebar. 
 */
function showTemplate() {

  const code = HtmlService.createTemplateFromFile('index.html')
    .evaluate()

  // if you want to debug, then uncomment this
  // and copy the code into codepen to play around with it
  // console.log(code.getContent())

  var ui = code
    .setTitle('bm Decrypter: Decrypt columns');

  SpreadsheetApp.getUi().showSidebar(ui);
}




