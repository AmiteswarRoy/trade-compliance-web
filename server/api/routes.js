import { users } from './data.json';
import moment from 'moment';
import XLSX from 'xlsx-js';

const simplifyUsers = collection => collection
  .map(({ user, seed }) => ({ ...user, seed }))
  .map(({ email, name, seed, picture }) => ({ email, name, seed, picture }));

function routes(router) {
  router.get('/users', (ctx) => {
    console.log('1111119999999998888');
    ctx.body = simplifyUsers(users.slice(0, 10));
  });

  router.get('/users/:seed', (ctx) => {
    const { seed } = ctx.params;
    const [ result ] = simplifyUsers(users.filter(user => user.seed === seed));

    if (!result) {
      ctx.body = { error: { message: 'User not found' } };
    } else {
      ctx.body = result;
    }
  });

  router.post('/users', (ctx) => {
    // ctx.request.body will contain the post body
    const body = ctx.request.body;
    ctx.body = body.users;
  });

  router.post('/upload', (ctx) => {
    console.log('upload entry: ');
    const body = ctx.request.body;
    console.log(body.content.filename);
    var workbook = XLSX.read(body.content.fileData, {type : 'binary'});
    workbook.SheetNames.forEach(function(sheetName){
        var row = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        var json_object = JSON.stringify(row);
        console.log(json_object);
        ctx.body = { fileName: body.content.filename, dateUploaded: moment(new Date()).format("DD/MMM/YYYY") };
    });
  });
}

// can't export directly function, run into const issue
// see: https://phabricator.babeljs.io/T2892
export default routes;
