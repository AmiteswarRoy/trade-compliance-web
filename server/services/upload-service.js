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
  await _uploadExcelData(body.content.fileData)
  .then( async (fileJson) => {
    const baseUrl = settingsProvider.get('TRADES_COMPLIANCE.API_URL');
    const request_delete = {
      url: `${baseUrl}/delete`,
      method: 'delete',
      timeout: settingsProvider.get('GENERAL.TIME_OUT')
    };
    await _uploadAPIcall(request_delete)
    .then( async (res) => {
      const request_upload = {
        url: `${baseUrl}/upload`,
        method: 'post',
        timeout: settingsProvider.get('GENERAL.TIME_OUT'),
        data: fileJson
      };
      await _uploadAPIcall(request_upload)
      .then((res) => {
        ctx.body = { fileName: body.content.filename, dateUploaded: moment(new Date()).format("DD/MMM/YYYY") };
      })
      .catch((err) => {
        ctx.status = 500;
        ctx.body = { error: { type: 'APPLICATION_ERROR', message: err.message }, fileName: body.content.filename, dateUploaded: moment(new Date()).format("DD/MMM/YYYY") };
      });
    })
    .catch((err) => {
      ctx.status = 500;
      ctx.body = { error: { type: 'APPLICATION_ERROR', message: err.message }, fileName: body.content.filename, dateUploaded: moment(new Date()).format("DD/MMM/YYYY") };
    });

  })
  .catch((err) => {
    ctx.status = 400;
    ctx.body = { error: { type: 'INVALID_REQUEST', message: err.message }, fileName: body.content.filename, dateUploaded: moment(new Date()).format("DD/MMM/YYYY") };
  });
};

let _formatExcel = (excelData) => {
  let formattedExcelData = [];
  try{
    forEach(excelData, function(row) {
      const validatedRows = _validateExcel(row);
      let modifiedRow = mapKeys(validatedRows, function(value, key) {
        return snakeCase(key);
      });
      formattedExcelData.push(modifiedRow);
    });
    return formattedExcelData;
  }
  catch(error){
    throw error;
  }
}

let _validateExcel = (row) => {
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

let _uploadExcelData = (fileData) => {
  const workbook = xlsx.read(fileData, {type : 'binary'});
  try{
    let jsonObject = {};
    workbook.SheetNames.forEach(function(sheetName){
      const rows = xlsx.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
      jsonObject = _formatExcel(rows);
    });
    return Promise.resolve(jsonObject);
  }
  catch(error){
    return Promise.reject(error);
  }
}

let _uploadAPIcall = (request) => {
  return axios(request)
    .then(res => res.data)
    .catch(error => Promise.reject(error));
};

export default uploadService;
