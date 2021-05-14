var express = require("express");
var router = express.Router();
const puppeteer = require("puppeteer");

router.post("/", async (req, res) => {

    let city = req.body.city;
    if (!city) {
        return res.status(500).send("City not valid")
    }

    const browser = await puppeteer.launch({
        headless: true,
        executablePath: process.env.CHROME_BIN || null,
        args: ['--no-sandbox', '--headless', '--disable-gpu', '--disable-dev-shm-usage']
    });

    const page = await browser.newPage();
    await page.goto(`https://www.tripadvisor.fr/Search?q=${city}&ssrc=e`);
    await page.waitForSelector('div.content-column')

    // Get the "viewport" of the page, as reported by the page.
    let results = await page.evaluate(() => {
        let restaurantsHTML = [...document.querySelectorAll('div.content-column')];
        return restaurantsHTML.map((restaurantHTML) => {
            return {
                id: restaurantHTML.querySelector('[class="result-title"]') ? parseInt((restaurantHTML.querySelector('[class="result-title"]').onclick + "").split(",")[11].split("'")[1]) : "",
                title: restaurantHTML.querySelector('[class="result-title"] span') ? restaurantHTML.querySelector('[class="result-title"] span').innerText : "",
                icon: restaurantHTML.querySelector('[class="aspect  is-shown-at-desktop"] > div') ? restaurantHTML.querySelector('[class="aspect  is-shown-at-desktop"] > div').style.backgroundImage.slice(4, -1).replace(/"/g, "") : "",
                address: restaurantHTML.querySelector('[class="address-text"]') ? restaurantHTML.querySelector('[class="address-text"]').innerText : "",
                opinions: {
                    number: restaurantHTML.querySelector('[class="review_count"]') ? restaurantHTML.querySelector('[class="review_count"]').innerText : "",
                    url: restaurantHTML.querySelector('[class="review_count"]') ? restaurantHTML.querySelector('[class="review_count"]').href : ""
                },
                grade: `${restaurantHTML.querySelector('[class="prw_rup prw_common_responsive_rating_and_review_count"] > span') ? parseInt((restaurantHTML.querySelector('[class="prw_rup prw_common_responsive_rating_and_review_count"] > span').className.slice(-2)) * 2 / 10) : ""}/10`
            }
        })
    });

    results = results.filter(restautant => restautant.title != "" && restautant.id != "" && restautant.address.toLowerCase().includes(`, ${req.body.city.toLowerCase()}`))

    res.json(results)
});

module.exports = router;
