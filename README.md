# NC News Seeding

- What Is This Project?

This project is a simple API designed to give me practical experience in building a backend service.

This API replicates the functionality of a simple news site, responding with data on users, articles, topics and comments from a database I have seeded.

The live version has been deployed via Render and can be found here:
https://nc-news-2dis.onrender.com/



- How to Run This Repo Locally

Enter the following commands into your terminal to get this project running on your system locally.

1. Clone this repo to your system:

```bash
git clone https://github.com/Kopfkinos/NC-News.git
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables

You will also need to set some environment variables to specify whether you are connecting to the test or development database. This repo uses dotenv to achieve this.

    1. Create two new files, ".env.test" and ".env.development".
    2. In .env.test, write the following global variable: PGDATABASE = nc_news_test
    3. In .env.development, write: PGDATABASE = nc_news

4.  Set up the development and test databases:

```bash
npm run setup-dbs
```

4. Seed your databases:

```bash
npm run seed-dev
```

- How to Run Tests

This repo uses Jest to run tests and Supertest to test API requests. There are three test suites, one for the seed file, one for the Express App and one for various utility functions.
You can run all of these tests in combination via the following npm script:

```bash
npm test
```

If you wish to only run a certain test suite, you can include a key word after this command such as "seed", "app" or "utils", respectively. e.g. To test the seeding file:

```bash
npm test seed
```
