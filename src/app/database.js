process.env.TNS_ADMIN = "C:/Users/rohit/Desktop/db_normalization/src/assets/Wallet_parsons";

const oracledb = require('oracledb');



async function run() {
    try {
        oracledb.initOracleClient({libDir: "C:/oracle-instantclient-basic-windows.x64-23.6.0.24.10/instantclient_23_6/"}); // Optional if already in PATH

        const connection = await oracledb.getConnection({
            user: "parsons",
            password: 'Database2023!',
            connectString: "(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=adb.eu-amsterdam-1.oraclecloud.com))(connect_data=(service_name=geeecf691ef1cf1_parsons_high.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))"
        });

        console.log("Successfully connected to Oracle Database");

        const result = await connection.execute("SELECT * from test");
        console.log("Query results:", result);

        // Display each row
        if (result.rows.length > 0) {
            result.rows.forEach((row) => {
                console.log(row);  // Logs each row in the console
            });
        } else {
            console.log("No data found.");
        }

        await connection.close();
    } catch (err) {
        console.error("Error running query:", err);
    }
}

run();

