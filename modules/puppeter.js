const puppeteer = require("puppeteer");

let browser;
const launchBrowser = async () => {
    if (browser) return browser;
    browser = await puppeteer.launch({
        headless: true,
        executablePath: process.env.CHROME_BIN || null,
        args: ['--no-sandbox', '--headless', '--disable-gpu', '--disable-dev-shm-usage']
    });
    return browser;
};

module.exports = launchBrowser;