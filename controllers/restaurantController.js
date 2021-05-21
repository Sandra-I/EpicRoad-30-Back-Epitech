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
                opinionsNuber: restaurantHTML.querySelector('[class="review_count"]') ? restaurantHTML.querySelector('[class="review_count"]').innerText.replace("avis","").replace(/\s/g, '') : "",
                grade: `${restaurantHTML.querySelector('[class="prw_rup prw_common_responsive_rating_and_review_count"] > span') ? parseInt((restaurantHTML.querySelector('[class="prw_rup prw_common_responsive_rating_and_review_count"] > span').className.slice(-2)) * 2 / 10) : ""}/10`
            }
        })
    });

    results = results.filter(restautant => restautant.title != "" && restautant.id != "" && restautant.address.toLowerCase().includes(`, ${req.query.city.toLowerCase()}`))

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
            address: document.querySelector('a[href="#MAPVIEW"]') ? document.querySelector('a[href="#MAPVIEW"]').innerText : "",
            map: document.querySelector('[class="rAA8XwlX"]') ? document.querySelector('[class="rAA8XwlX"]').src : "",
            images: document.querySelectorAll('[class="mini_photo_wrap"] img') ? [...document.querySelectorAll('[class="mini_photo_wrap"] img')].map(img => img.src) : [],
            phone: document.querySelector('a[href*="tel:"]') ? document.querySelector('a[href*="tel:"]').innerText : "",
            site: document.querySelector('[class="_13OzAOXO _2VxaSjVD"] [class="_2wKz--mA _15QfMZ2L"]') ? document.querySelector('[class="_13OzAOXO _2VxaSjVD"] [class="_2wKz--mA _15QfMZ2L"]').href : "",
            menu: document.querySelector('[class="_13OzAOXO _2VxaSjVD ly1Ix1xT"] [class="_2wKz--mA _15QfMZ2L"]') ? document.querySelector('[class="_13OzAOXO _2VxaSjVD ly1Ix1xT"] [class="_2wKz--mA _15QfMZ2L"]').href : "",
            priceRange: [...document.querySelectorAll('[class="_14zKtJkz"]')].find(e => e.innerText == "FOURCHETTE DE PRIX") ? [...document.querySelectorAll('[class="_14zKtJkz"]')].find(e => e.innerText == "FOURCHETTE DE PRIX").nextSibling.innerText : "",
            type: [...document.querySelectorAll('[class="_14zKtJkz"]')].find(e => e.innerText == "CUISINES") ? [...document.querySelectorAll('[class="_14zKtJkz"]')].find(e => e.innerText == "CUISINES").nextSibling.innerText : "",
            diet: [...document.querySelectorAll('[class="_14zKtJkz"]')].find(e => e.innerText == "RÉGIMES SPÉCIAUX") ? [...document.querySelectorAll('[class="_14zKtJkz"]')].find(e => e.innerText == "RÉGIMES SPÉCIAUX").nextSibling.innerText : "",
            grades: [...document.querySelectorAll('[class="jT_QMHn2"]')].map(e => { return { label: e.querySelector('[class="_2vS3p6SS"]').innerText, grade: `${parseInt(e.querySelector('[class="_377onWB-"] > span').className.slice(-2)) * 2 / 10}/10` } }),
            opinions: {
                number: document.querySelector('[class="_3Wub8auF"]') ? document.querySelector('[class="_3Wub8auF"]').innerText.replace("avis","").replace(/\s/g, '') : "",
                ranges: [...document.querySelectorAll('[class="prw_rup prw_filters_detail_checkbox ui_column separated is-5"] [class="ui_checkbox item"]')].map(e => { return {label: e.querySelector('label').innerText, number: e.querySelector('[class="row_num  is-shown-at-tablet"]').innerText.replace(/\s/g, '')}}),
                lastOpinions: [...document.querySelectorAll('[class="review-container"] [class="ui_column is-9"]')].map(e => { return {grade: `${parseInt(e.querySelector('[class*="ui_bubble_rating bubble"]').className.slice(-2)) * 2 / 10}/10`, title: e.querySelector('[class="noQuotes"]').innerText}})
            }
        }
    });

    res.json(results)
});




module.exports = router;
