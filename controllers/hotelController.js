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
                opinionsNuber: hotelHTML.querySelector('[class="review_count"]') ? hotelHTML.querySelector('[class="review_count"]').innerText.replace("avis","").replace(/\s/g, '') : "",
                grade: `${hotelHTML.querySelector('[class="prw_rup prw_common_responsive_rating_and_review_count"] > span') ? parseInt((hotelHTML.querySelector('[class="prw_rup prw_common_responsive_rating_and_review_count"] > span').className.slice(-2)) * 2 / 10) : ""}/10`
            }
        })
    });

    results = results.filter(hotel => hotel.title != "" && hotel.id != "" && hotel.address.toLowerCase().includes(`, ${req.query.city.toLowerCase()}`))

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
            title: document.querySelector('#HEADING') ? document.querySelector('#HEADING').innerText : "",
            address: document.querySelector('[class="_1EqMnQsE _1YIGmrPj jke2_wbp"]') ? document.querySelector('[class="_1EqMnQsE _1YIGmrPj jke2_wbp"]').innerText : "",
            images: document.querySelectorAll('[class="_3w-DJK-r"] img') ? [...document.querySelectorAll('[class="_3w-DJK-r"] img')].map(img => img.src) : [],
            phone: document.querySelector('a[href*="tel:"]') ? document.querySelector('a[href*="tel:"]').innerText : "",
            site: document.querySelector('[data-blcontact*="URL_HOTEL"] a') ? document.querySelector('[data-blcontact*="URL_HOTEL"] a').href : "",
            description: document.querySelector('[class="_2f_ruteS _1bona3Pu _2-hMril5 _2uD5bLZZ"] [class="cPQsENeY"]') ? document.querySelector('[class="_2f_ruteS _1bona3Pu _2-hMril5 _2uD5bLZZ"] [class="cPQsENeY"]').innerText : "",
            caracteristics: [...document.querySelectorAll('[class="_1mJdgpMJ"]')].filter(e => e.nextSibling.className.includes("_1nAmDotd")).map(e => {return {label: e.innerText, feature: [...e.nextSibling.querySelectorAll('[class="_2rdvbNSg"]')].map(f => f.innerText)}}),
            grades: [...document.querySelectorAll('[class*="_318JyS8B"] [class*="_1krg1t5y"]')].map(e => { return { label: e.querySelector('[class="_1h7NKZWM"]').innerText, grade: `${parseInt(e.querySelector('[class*="ui_bubble_rating bubble_"]').className.slice(-2)) * 2 / 10}/10` } }),
            opinions: {
                number: document.querySelector('[class="_15eFvJyR _3nlVsadw"] [class="_33O9dg0j"]') ? document.querySelector('[class="_15eFvJyR _3nlVsadw"] [class="_33O9dg0j"]').innerText.replace("avis","").replace(/\s/g, '') : "",
                ranges: [...document.querySelectorAll('[class="ui_column is-5 is-12-mobile"] [class="ui_checkbox _3gEj_Jb5"]')].map(e => { return {label: e.querySelector('label').innerText, number: e.querySelector('[class="_3fVK8yi6"]').innerText.replace(/\s/g, '')}}),
                lastOpinions: [...document.querySelectorAll('[class="_2wrUUKlw _3hFEdNs8"]')].map(e => { return {grade: `${parseInt(e.querySelector('[class*="ui_bubble_rating bubble"]').className.slice(-2)) * 2 / 10}/10`, title: e.querySelector('[class="glasR4aX"]').innerText, description: e.querySelector('[class="IRsGHoPm"]').innerText}})
            }
        }
    });

    res.json(results)
});


module.exports = router;
