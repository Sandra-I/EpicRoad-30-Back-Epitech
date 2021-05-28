const app = require("../index");
const drinkTest = require("./drink.test");
const eatTest = require("./eat.test");
const activityTest = require("./activity.test");
const hotelTest = require("./hotel.test");
const restaurantTest = require("./restaurant.test");

drinkTest(app);
eatTest(app);
activityTest(app);
hotelTest(app);
restaurantTest(app);
