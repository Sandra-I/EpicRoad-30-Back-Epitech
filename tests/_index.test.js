const app = require("../index");
const drinkTest = require("./drink.test");
const eatTest = require("./eat.test");
const hotelTest = require("./hotel.test");
const favorisTest = require("./favoris.test");


drinkTest(app);
eatTest(app);
hotelTest(app);
favorisTest(app);



