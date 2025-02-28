# NC News Seeding

- To be able to create this database locally, you first need to set up your environment variable to specify which database you'll be connecting to. This repo uses dotenv to achieve this. 

1. Run command "npm install" to ensure dotenv is installed. 
2. Create two new files, ".env.test" and ".env.development". 
3. In .env.test, write the following global variable: PGDATABASE = nc_news_test
4. In .env.development, write: PGDATABASE = nc_news
5. Be sure to save, and you can now run the command "npm run setup-dbs" to create your test and dev databases. 