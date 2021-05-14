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

router.get("/:id", async (req, res) => {

    let id = req.params.id
    if (!id) {
        return res.status(500).send("Id not valid")
    }

    await launchPage();
    await page.goto(`https://www.tripadvisor.fr/${id}`);

    // Get the "viewport" of the page, as reported by the page.
    let results = await page.evaluate(() => {
        return {
            title: document.querySelector('[data-test-target="top-info-header"]') ? document.querySelector('[data-test-target="top-info-header"]').innerText : "",
            images: document.querySelectorAll('[class="mini_photo_wrap"] img') ? [...document.querySelectorAll('[class="mini_photo_wrap"] img')].map(img => img.src) : [],

        }
    });

    res.json(results)
});




module.exports = router;
