const path = require('path');
const {Builder, By, until} = require('selenium-webdriver');

if(process.argv.length < 3) {
    console.log('usage: ' + path.basename(process.argv[1]) + ' <tag>');
    process.exit();
}
let search = process.argv[2];
// subject to change
let linksid = '.fuqBx';

(async () => {
    let driver = await new Builder().forBrowser('safari').build();
    try {
        await driver.get('https://www.instagram.com/instagram');
        let input = await driver.wait(until.elementLocated(By.css('input[type=text]')), 10000);
        await input.sendKeys(search);
        // await driver.wait(until.elementLocated(By.css('input')), 10000).sendKeys(search);
        let dropdown = await driver.wait(until.elementLocated(By.css(linksid)), 10000);
        let links = await dropdown.findElements(By.css('a'));
        let tags = [];
        for(let link of links) {
            let href = await link.getAttribute('href');
            if(href.indexOf('/explore/tags') === -1) continue;
            let tag = await (await link.findElement(By.css('div > div > div:first-child > span'))).getText();
            let count = (await (await link.findElement(By.css('div > div > div:last-child > span > span'))).getText()).replace(/\,/g, '');
            console.log(tag + ',' + count);
            tags.push(tag);
        }
        console.log(tags.join(' '));
    } finally {
        await driver.quit();
    }
})();