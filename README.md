```
yarn add sequelize-cli -D
sudo apt-get install postgresql-client-common postgresql-client
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"
yarn sequelize db:create
yarn sequelize db:migrate
```