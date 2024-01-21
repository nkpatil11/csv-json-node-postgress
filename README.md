# node-csv-json
Node CSV to JSON conversion and bulk write to PostgreSQL

## Common setup

Clone the repo and install the dependencies.

```bash
git clone https://github.com/nkpatil11/csv-json-node-postgress.git
```
```bash
cd csv-json-node-postgress
```

```bash
npm install
```
## Steps for read and write access (recommended)

Step 1: Open `.env` and inject your credentials so it looks like this

```
PORT=3000
POSTGRES_USER=<POSTGRES_USER>
POSTGRES_PASSWORD=<POSTGRES_PASSWORD>
POSTGRES_DB=<POSTGRES_DB>
POSTGRES_PORT=<POSTGRES_PORT>
CSV_FILE_PATH=files/user-data.csv
```
Step 2: Open the terminal and run the below command to create users table in connected postgres database
```bash
npm run create
```

Step 3: To start the express server, run the following
```bash
npm run start:dev
```

Step 4: 
Open Postman or any client to call POST API [http://localhost:3000/users](http://localhost:3000/users) to point CSV and convert it into JSON and insert data to the Postgres database.

once data is inserted successfully same API returns **age distribution in percentage** in response and it will print in the console as well.

Final Step 5:
Way to see **age distribution** in separate API

GET API [http://localhost:3000/users](http://localhost:3000/users) to see age distribution in response and console.
