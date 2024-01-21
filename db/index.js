import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

// DB user credentials
const config = {
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  port: process.env.POSTGRES_PORT,
};

const pool = new pg.Pool(config);

pool.on('connect', () => {
  console.log('connected to the Database');
});

// Create table using node command: 'npm run create'
const createTables = () => {
  const userTable = `CREATE TABLE IF NOT EXISTS
      public.users(
        name VARCHAR NOT NULL,
        age INT4 NOT NULL,
        address jsonb NULL,
        additional_info jsonb NULL,
        id SERIAL4 PRIMARY KEY NOT NULL
      )`;
  pool.query(userTable)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

const calculateAgeDist = async () => {
  const distributionQuery = `SELECT CASE WHEN age < 20 THEN '< 20'
              WHEN age BETWEEN 20 AND 40 THEN '20 to 40' 
              WHEN age BETWEEN 40 AND 60 THEN '40 to 60'
              WHEN age > 60 THEN '> 60'
            END AS "Age Group",
            round((COUNT(*) / (SUM(COUNT(*)) OVER() )) * 100,2) as "Distribution(%)"
            FROM users
            GROUP BY 1;`;
  const distribution = await pool.query(distributionQuery);
  return distribution.rows;
};

//export pool, createTables and calculateAgeDist to be accessible  from an where within the application
module.exports = {
  createTables,
  pool,
  calculateAgeDist
};

require('make-runnable');