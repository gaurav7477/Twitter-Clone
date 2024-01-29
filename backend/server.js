import app from './app.js'
import dotenv from 'dotenv';
import connectDatabase from './database/database.js'

// configiration

dotenv.config({ path: "./config.env" });

// database connection

connectDatabase();

// server

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on PORT: ${process.env.PORT}`);

});


