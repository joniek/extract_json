/**
 * Custom scripts that:
 * (1) Creates a new sheet named 'json_url' to enter a url to a json file.
 * (2) Processes the json file into a 2D table, and exports the values to a new sheet named 'json_values'.
 * 
 * This script uses Google Sheets.
 * To use this script, copy and paste the scripts below to App Scripts.
 */


/**
 * @desc Custom Menu.
 */

// function onOpen(e) {       // Addon Menu.
//   SpreadsheetApp.getUi().createAddonMenu()

function onOpen() {    // App custom menu.
  let ui = SpreadsheetApp.getUi();
  ui.createMenu('Extract json')

    .addItem('Add json url','set_new_json_url_sheet')
    .addItem('Extract json values','extract_json_values')
    .addToUi();
}



/**
 * @desc Sets up a sheet to add Json URL.
 */
function set_new_json_url_sheet(){
  var json_url_sheet = get_or_create_sheet('json_url');
  if (json_url_sheet.getMaxRows() > 1){
    json_url_sheet.deleteRows(1,json_url_sheet.getMaxRows()-1);
  }
  if (json_url_sheet.getMaxColumns() > 1){
    json_url_sheet.deleteColumns(1,json_url_sheet.getMaxColumns()-1);
  }
  json_url_sheet.getRange(1,1).setValue('PASTE JSON URL HERE');
}


/**
 * @desc 
 */
function extract_json_values(){
  var json_url = get_json_url();

  if (json_url == -1){
    alert('json url is not valid.');
  }

  else {
    var json_object = get_json_object(json_url);
    var json_array = json_to_array(json_object);
    var sheet = get_or_create_sheet('json_values');
    sheet.getRange(1,1,json_array.length,json_array[0].length).setValues(json_array);
  }
}


/**
 * @desc Gets json url from json_url sheet.
 * @return {string} json_url
 */
function get_json_url(){
  var json_url_sheet = get_or_create_sheet('json_url');
  var json_url = json_url_sheet.getRange(1,1).getValue();
  if (valid_json_url(json_url) & valid_url(json_url)){
    return json_url;
  }
  else{
    return -1;
  }
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


/**
 * @desc Validates URLs. 
 * @author Stackoverflow https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
 * @param {string} str
 * @return {boolean}
 */
function valid_url(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}


/**
 * @desc Tests if URL is a valid SNURL.json.
 * @param {string} url
 * @return {boolean}
 */
function valid_json_url(json_url){
  var pattern = new RegExp('.json');
  return pattern.test(json_url);
}



/** 
 * @desc Takes a URL location of a Json file, and returns a Json object.
 * @param {url} the location of the json file.
 * @return {object} json object.
 */
function get_json_object(url){
  return JSON.parse(UrlFetchApp.fetch(url));
}


/**
 * @desc Displays an alert.
 */
function alert(message){
  var ui = SpreadsheetApp.getUi();
  ui.alert(message);
}


/**
 * @desc Takes a json object and turns it into a 2 dimensional array.
 * If each row has variation in the number and key names, new key names are added as new columns to the end.
 * @param {object} json_object
 * @return {array} 2 dimensional array.
 */
function json_to_array(json_object){
  let array = [];
  let header = [];

  // Get key names and set as headers.
  for (row in json_object){
    let keys = Object.keys(json_object[row]);
    for (k in keys){
      if (!header.includes(keys[k])){
        header.push(keys[k]);
      }
    }
  }
  array.push(header);

  // Add each row to the array.
  for (row in json_object){
    let temp_row = new Array(header.length);
    for (h in header){
      temp_row[header.indexOf(header[h])] = json_object[row][header[h]];
    }
    array.push(temp_row);
  }

  return array;
}






