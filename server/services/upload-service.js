import moment from 'moment';
import xlsx from 'xlsx-js';
import fs from 'fs';
import { keys, mapKeys, snakeCase, forEach, differenceBy, isEmpty, intersection } from 'lodash';
import config from './../config';
import axios from 'axios';
import settingsProvider from 'utils/settings-provider';

let uploadService = {};

uploadService.upload = async (ctx) => {
  console.log('upload entry: '+ctx.request.body.content.filename);
  const body = ctx.request.body;
  await uploadService.uploadExcelData(body.content.fileData)
  .then( async (fileJson) => {
    const baseUrl = settingsProvider.get('TRADES_COMPLIANCE.API_UPLOAD_URL');
    const request = {
      url: `${baseUrl}`,
      method: 'post',
      timeout: settingsProvider.get('GENERAL.TIME_OUT'),
      data: fileJson
    };
    await uploadService.uploadData(request)
    .then((res) => {
      ctx.body = { fileName: body.content.filename, dateUploaded: moment(new Date()).format("DD/MMM/YYYY") };
    })
    .catch((err) => {
      ctx.body = { error: { message: 'Could not upload the file' } };
    });
  })
  .catch((err) => {
    ctx.body = { error: { message: 'Could not upload the file' } };
  });
};

uploadService.formatExcel = (excelData) => {
  let formattedExcelData = [];
  try{
    forEach(excelData, function(row) {
      const validatedRows = uploadService.validateExcel(row);
      let modifiedRow = mapKeys(validatedRows, function(value, key) {
        return snakeCase(key);
      });
      formattedExcelData.push(uploadService.combineGoodsCodes(modifiedRow));
    });
    return formattedExcelData;
  }
  catch(error){
    throw error;
  }
}

uploadService.validateExcel = (row) => {
  let isSingleValid = true;
  let isGroupValid = true;
  try{
    const missingProperties = differenceBy(config.excelHeaderList, keys(row));
    const missingRequiredPropertiesSingle = intersection(missingProperties, config.excelRequiredHeaderListSngle);
    if(missingRequiredPropertiesSingle.length > 0) isSingleValid = false;
    else{
      forEach(keys(config.excelRequiredHeaderListGroup), function(_requiredPropertyGroup) {
        if(config.excelRequiredHeaderListGroup[_requiredPropertyGroup].length > 0) {
          const missingRequiredPropertiesGroup = intersection(missingProperties, config.excelRequiredHeaderListGroup[_requiredPropertyGroup]);
          if(missingRequiredPropertiesGroup.length === config.excelRequiredHeaderListGroup[_requiredPropertyGroup].length) isGroupValid = false;
        }
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

uploadService.combineGoodsCodes = (row) => {
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

 uploadService.uploadExcelData = (fileData) => {
  const workbook = xlsx.read(fileData, {type : 'binary'});
  try{
    let jsonObject = {};
    workbook.SheetNames.forEach(function(sheetName){
      const rows = xlsx.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
      jsonObject = uploadService.formatExcel(rows);
      let jsonString = JSON.stringify(jsonObject, null, 2);
      fs.writeFile("excel.txt", jsonString, (err) => {
        //console.log(jsonObject);
      });
      //Make java api call
    });
    return Promise.resolve(jsonObject);
  }
  catch(error){
    console.error(error);
    return Promise.reject({ message:error });
  }
}

uploadService.uploadData = (request) => {
  return axios(request)
    .then(res => res.data)
    .catch(res => Promise.reject({ message: res.data.message }));
};

export default uploadService;
