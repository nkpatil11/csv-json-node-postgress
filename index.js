import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import { calculateAgeDist, pool } from './db';
import fs from 'fs';
import path from 'path';
import csvjson from 'csvjson';
import dotenv from 'dotenv';
dotenv.config();
const app = express() // setup express application
const PORT = process.env.PORT || 4000;

app.use(logger('dev')); // log requests to the console

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// get age distribution calculation
app.get('/', async (req, res) => {
  try {
    const distribution = await calculateAgeDist();
    if (distribution && distribution.length) {
      console.log("Age distribution calculated successfully. ", distribution);
      res.status(200).send({
        status: 'Age distribution calculated successfully.',
        result: distribution,
      });
    } else {
      res.status(404).send({
        status: 'Records not found.',
        result: [],
      });
    }
  } catch (error) {
    console.log('error ', error);
    res.status(400).json({ error });
  }
});

// Parse data from csv to json and insert into Postgresql
app.post('/users', async (req, res) => {
  try {
    // Read csv file
    const data = fs.readFileSync(path.join(__dirname, `./${process.env.CSV_FILE_PATH}`), { encoding: 'utf8' });

    const options = {
      delimiter: ',', // optional
      quote: '"' // optional
    };

    let result = csvjson.toSchemaObject(data, options);
    // Print an json object after parsed from csv
    if (result && result.length)
      console.log('Print JSON Object ', result[0]);
    let query = `INSERT INTO users (name, age, address, additional_info) VALUES `;

    // generate bulk write query
    for (let i = 0; i < result.length; i++) {
      let obj = result[i];
      query += `('${obj.name.firstName} ${obj.name.lastName}',${obj.age},'${JSON.stringify(obj.address)}','{"gender":${JSON.stringify(obj.gender)}}')${i === result.length - 1 ? " " : ","}\n`;
    }

    await pool.query(query);
    // Get age distribution calculation
    const distribution = await calculateAgeDist();

    console.log("Age distribution calculated successfully. ", distribution);
    res.status(202).send({
      status: 'Records inserted and age distribution calculated successfully.',
      result: distribution,
    });
  } catch (error) {
    console.log('error ', error);
    res.status(400).json({ error });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});