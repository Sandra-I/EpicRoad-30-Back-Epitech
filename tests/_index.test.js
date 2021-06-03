const app = require("../index");
const authTest = require("./auh.test");
const dataTest = require("./data.test");
const routesTest = require("./routes.test");

authTest(app);
dataTest(app);
routesTest(app);
