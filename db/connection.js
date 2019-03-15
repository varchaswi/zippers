const ADODB = require('node-adodb');
const connection = ADODB.open('Provider=Microsoft.ACE.OLEDB.12.0;Data Source=../test.accdb;Persist Security Info=False;');
module.exports =  connection