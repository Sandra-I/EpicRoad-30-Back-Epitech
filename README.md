# EpicRoad-30-Back README

## INSTALLATION

A little intro about the installation.

Commands :
```
git clone git@gitlab.com:t-web-8003/epicroad-30-back.git
cd ../path/to/the/file
npm install
```

**Create a `.env` file** with the same credentials as `.env-example` example. You can find API keys in the README.md of the EpicRoad main project.

```
docker-compose up
```

## TEST

To run the test run the following command

Command :
```
npm run test
```
The folder containing the test files is tests\


## TECHNOLOGIES

* Language: Node JS
* Routing: Express
* ORM: Sequelize
* Test: SuperTest
* Database: Mysql

## API USED
* Hotels and Activities: Amadeus API
* Transport: Google Directions API
* Eats and Drinks: Foursquare API

Api documentation: https://documenter.getpostman.com/view/13150479/TzXtHL96
