function myFunction() {
  
}

/**
 * @desc Sets up a sheet to add Json URL.
 */
function set_new_json_url_sheet(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var json_url = ss.insertSheet('json_url');

}


/**
 * @desc Gets json url from json_url sheet.
 */
function get_json_url(){

}


/**
 * @desc Gets or creates a sheet.
 * @param {string} sheet_name
 * @return {sheet} 
 */
function get_or_create_sheet(sheet_name){
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  if (spreadsheet.getSheetByName(sheet_name) == null){
    spreadsheet.insertSheet(sheet_name);
  }

  return spreadsheet.getSheetByName(sheet_name);
}