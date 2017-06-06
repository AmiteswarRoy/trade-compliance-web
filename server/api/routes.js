import { users } from './data.json';
import moment from 'moment';
import xlsx from 'xlsx-js';
import fs from 'fs';
import { isEmpty, mapKeys, snakeCase, forEach } from 'lodash';

const simplifyUsers = collection => collection
  .map(({ user, seed }) => ({ ...user, seed }))
  .map(({ email, name, seed, picture }) => ({ email, name, seed, picture }));

function formatExcel(excelData) {
  let formattedExcelData = [];
  forEach(excelData, function(row) {
    let modifiedRow = mapKeys(row, function(value, key) {
      return snakeCase(key);
    });
    formattedExcelData.push(combineGoodsCodes(modifiedRow));
  });
  return formattedExcelData;
}

function validateExcel(row) {
  
  return row;
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
    console.log('upload entry: ');
    const body = ctx.request.body;
    console.log(body.content.filename);
    uploadExcelData(body.content.fileData, (error, setUpResponse) => {
      if(error !== null){
        ctx.body = { error: { message: 'Could not upload the file' } };
      }
      else{
        ctx.body = { fileName: body.content.filename, dateUploaded: moment(new Date()).format("DD/MMM/YYYY") };
      }
    });
  });

}

// can't export directly function, run into const issue
// see: https://phabricator.babeljs.io/T2892
export default routes;
