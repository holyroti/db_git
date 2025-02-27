const oracledb = require('oracledb');
const dbConfig = require('../config/dbConfig');

process.env.TNS_ADMIN = "C:/Users/rohit/Desktop/db_normalization/src/assets/Wallet_parsons";


function initOracleClient() {
  oracledb.initOracleClient({ libDir: "C:/oracle-instantclient-basic-windows.x64-23.6.0.24.10/instantclient_23_6/" });
}

module.exports = { initOracleClient };
