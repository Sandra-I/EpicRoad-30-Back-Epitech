var express = require("express");
var router = express.Router();
var launchBrowser = require('../modules/puppeter')

let page;
const launchPage = async () => {
    if (page) return;
    let browser = await launchBrowser()
    page = await browser.newPage();
};
router.post("/", async (req, res) => {

    let city = req.body.city;
    if (!city) {
        return res.status(500).send("City not valid")
    }

    await launchPage();
    await page.goto(`https://www.tripadvisor.fr/Search?q=${city}&src=h&ssrc=h`);
    await page.waitForSelector('div.content-column')

    // Get the "viewport" of the page, as reported by the page.
    let results = await page.evaluate(() => {
        let hotelsHTML = [...document.querySelectorAll('div.content-column')];
        return hotelsHTML.map((hotelHTML) => {
            return {
                id: hotelHTML.querySelector('[class="result-title"]') ? parseInt((hotelHTML.querySelector('[class="result-title"]').onclick + "").split(",")[11].split("'")[1]) : "",
                title: hotelHTML.querySelector('[class="result-title"] span') ? hotelHTML.querySelector('[class="result-title"] span').innerText : "",
                icon: hotelHTML.querySelector('[class="aspect  is-shown-at-desktop"] > div') ? hotelHTML.querySelector('[class="aspect  is-shown-at-desktop"] > div').style.backgroundImage.slice(4, -1).replace(/"/g, "") : "",
                address: hotelHTML.querySelector('[class="address-text"]') ? hotelHTML.querySelector('[class="address-text"]').innerText : "",
                opinions: {
                    number: hotelHTML.querySelector('[class="review_count"]') ? hotelHTML.querySelector('[class="review_count"]').innerText : "",
                    url: hotelHTML.querySelector('[class="review_count"]') ? hotelHTML.querySelector('[class="review_count"]').href : ""
                },
                grade: `${hotelHTML.querySelector('[class="prw_rup prw_common_responsive_rating_and_review_count"] > span') ? parseInt((hotelHTML.querySelector('[class="prw_rup prw_common_responsive_rating_and_review_count"] > span').className.slice(-2)) * 2 / 10) : ""}/10`
            }
        })
    });

    results = results.filter(hotel => hotel.title != "" && hotel.id != "" && hotel.address.toLowerCase().includes(`, ${req.body.city.toLowerCase()}`))

    res.json(results)
});

module.exports = router;
