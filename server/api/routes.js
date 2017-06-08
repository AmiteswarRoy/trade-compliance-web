import { users } from './data.json';
import moment from 'moment';
import xlsx from 'xlsx-js';
import fs from 'fs';
import { keys, mapKeys, snakeCase, forEach, differenceBy, isEmpty, intersection } from 'lodash';
import config from './../config';

function formatExcel(excelData) {
  let formattedExcelData = [];
  try{
    forEach(excelData, function(row) {
      const validatedRows = validateExcel(row);
      let modifiedRow = mapKeys(validatedRows, function(value, key) {
        return snakeCase(key);
      });
      formattedExcelData.push(combineGoodsCodes(modifiedRow));
    });
    return formattedExcelData;
  }
  catch(error){
    throw error;
  }
}

function validateExcel(row) {
  let isSingleValid = true;
  let isGroupValid = true;
  try{
    const missingProperties = differenceBy(config.excelHeaderList, keys(row));
    const missingRequiredPropertiesSingle = intersection(missingProperties, config.excelRequiredHeaderListSngle);
    if(missingRequiredPropertiesSingle.length > 0) isSingleValid = false;
    else{
      forEach(keys(config.excelRequiredHeaderListGroup), function(_requiredPropertyGroup) {
        const missingRequiredPropertiesGroup = intersection(missingProperties, config.excelRequiredHeaderListGroup[_requiredPropertyGroup]);
        if(missingRequiredPropertiesGroup.length === config.excelRequiredHeaderListGroup[_requiredPropertyGroup].length) isGroupValid = false;
      });
    }
    if(isSingleValid && isGroupValid){
      forEach(missingProperties, function(_missingProperty) {
        row[_missingProperty] = null;
      });
      return row;
    }
    else throw new Error('Invalid Excel file: missing required properties');
  }
  catch(error){
    throw error;
  }
}

function combineGoodsCodes(row) {
  if(row.goods_codes_1){
    row['tc_goods_codes'] = row.goods_codes_1;
    if(row.goods_codes_2) row['tc_goods_codes'] = row['tc_goods_codes'] +'; '+ row.goods_codes_2;
    if(row.goods_codes_3) row['tc_goods_codes'] = row['tc_goods_codes'] +'; '+ row.goods_codes_3;
  }
  else if(row.goods_codes_2){
    row['tc_goods_codes'] = row.goods_codes_2;
    if(row.goods_codes_3) row['tc_goods_codes'] = row['tc_goods_codes'] +'; '+ row.goods_codes_3;
  }
  else if(row.goods_codes_3) row['tc_goods_codes'] = row.goods_codes_3;
  return row;
}

function uploadExcelData(fileData, callback) {
  const workbook = xlsx.read(fileData, {type : 'binary'});
  try{
    workbook.SheetNames.forEach(function(sheetName){
      const rows = xlsx.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
      let jsonObject = formatExcel(rows);
      jsonObject = JSON.stringify(jsonObject, null, 2);
      fs.writeFile("excel.txt", jsonObject, (err) => {
        //console.log(jsonObject);
      });
      //Make java api call
      return callback(null, {'success': true});
    });
  }
  catch(error){
    console.error(error);
    return callback(error);
  }
}

function routes(router) {

  router.post('/upload', (ctx) => {
    console.log('upload entry: '+ctx.request.body.content.filename);
    const body = ctx.request.body;
    uploadExcelData(body.content.fileData, (error, setUpResponse) => {
      if(error !== null){
        ctx.body = { error: { message: 'Could not upload the file' } };
      }
      else{
        ctx.body = { fileName: body.content.filename, dateUploaded: moment(new Date()).format("DD/MMM/YYYY") };
      }
    });
  });

  router.post('/search', (ctx) => {
    console.log('In search entry: ');
    const body = ctx.request.body;
    console.log(body);
    ctx.body = [{ item_code: 'item_code_1', item_description: 'item_description_1', goods: 'goods_1', match_phrase: 'match_phrase_1' },{ item_code: 'item_code_2', item_description: 'item_description_2', goods: 'goods_2', match_phrase: 'match_phrase_1' }];
  });

}

// can't export directly function, run into const issue
// see: https://phabricator.babeljs.io/T2892
export default routes;
