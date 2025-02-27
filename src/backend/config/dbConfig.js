process.env.TNS_ADMIN = "C:/Users/rohit/Desktop/db_normalization/src/assets/Wallet_parsons";

module.exports = {
    user: "parsons",
    password: 'Database2023!',
    connectString: "(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=adb.eu-amsterdam-1.oraclecloud.com))(connect_data=(service_name=geeecf691ef1cf1_parsons_high.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))"
  };
  

