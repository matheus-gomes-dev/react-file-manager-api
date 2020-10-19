## Running Locally

```
npm install
npm start
```

The API will be running on port 5000

## Database Settings

This project uses PostreSQL, you will need it installed in your machine, and also sequelize-cli
to create the database and run the migrations in the project root folder:

```
yarn add sequelize-cli -D
yarn sequelize db:create
yarn sequelize db:migrate
```

## Unit Tests

```
npm test
``` 