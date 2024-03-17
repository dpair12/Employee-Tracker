  // Import and require mysql2
  const mysql = require('mysql2');
  
  // Connect to database
  const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user:'root',
      // MySQL password
      //Enter password
      password: '',
      database: 'hr_db' 
    },
    //Print this message to the console once connected to hr_db
    console.log(`Connected to the hr_db database. Welcome to Employee Tracker!`)

  );
  


//Exports mysql connection to database for use in index.js and db.js
module.exports = { db };

