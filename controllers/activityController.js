var express = require("express");
var router = express.Router();
var launchBrowser = require('../modules/puppeter')

let page;
const launchPage = async () => {
    if (page) return;
    let browser = await launchBrowser()
    page = await browser.newPage();
};

router.get("/", async (req, res) => {

    let city = req.query.city;
    if (!city) {
        return res.status(500).send("City not valid")
    }

    await launchPage();
    await page.goto(`https://www.tripadvisor.fr/Search?q=${city}&ssrc=A`);
    await page.waitForSelector('div.content-column')

    // Get the "viewport" of the page, as reported by the page.
    let results = await page.evaluate(() => {
        let activitiesHTML = [...document.querySelectorAll('div.content-column')];
        return activitiesHTML.map((activityHTML) => {
            return {
                id: activityHTML.querySelector('[class="result-title"]') ? parseInt((activityHTML.querySelector('[class="result-title"]').onclick + "").split(",")[11].split("'")[1]) : "",
                title: activityHTML.querySelector('[class="result-title"] span') ? activityHTML.querySelector('[class="result-title"] span').innerText : "",
                icon: activityHTML.querySelector('[class="aspect  is-shown-at-desktop"] > div') ? activityHTML.querySelector('[class="aspect  is-shown-at-desktop"] > div').style.backgroundImage.slice(4, -1).replace(/"/g, "") : "",
                address: activityHTML.querySelector('[class="address-text"]') ? activityHTML.querySelector('[class="address-text"]').innerText : "",
                opinions: {
                    number: activityHTML.querySelector('[class="review_count"]') ? activityHTML.querySelector('[class="review_count"]').innerText : "",
                    url: activityHTML.querySelector('[class="review_count"]') ? activityHTML.querySelector('[class="review_count"]').href : ""
                },
                grade: `${activityHTML.querySelector('[class="prw_rup prw_common_responsive_rating_and_review_count"] > span') ? parseInt((activityHTML.querySelector('[class="prw_rup prw_common_responsive_rating_and_review_count"] > span').className.slice(-2)) * 2 / 10) : ""}/10`
            }
        })
    });

    results = results.filter(activity => activity.title != "" && activity.id != "" && activity.address.toLowerCase().includes(`, ${req.query.city.toLowerCase()}`))

    res.json(results)
});

module.exports = router;
