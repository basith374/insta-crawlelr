const path = require('path');
const {Builder, By, until} = require('selenium-webdriver');

if(process.argv.length < 3) {
    console.log('usage: ' + path.basename(process.argv[1]) + ' <tag> [<level>]');
    process.exit();
}
let starttag = process.argv[2];
// subject to change
let linksid = '._7UhW9 a';
let countsid = 'g47SY';

let leveldeep = parseInt(process.argv[3], 10) || 1;

(async () => {
    let driver = await new Builder().forBrowser('safari').build();
    try {
        let utags = {};
        let finden = async (tag, level) => {
            await driver.get('https://www.instagram.com/explore/tags/' + tag);
            let taglinks = await driver.wait(until.elementsLocated(By.css(linksid)), 10000);
            let count = await driver.wait(until.elementLocated(By.className(countsid)), 10000).getText();
            utags[tag] = count;
            console.log('#' + tag + ',' + count.replace(/\,/g, ''));
            if(level < leveldeep) {
                let tags = [];
                for(let e of taglinks) {
                    let tag = (await e.getText()).slice(1);
                    if(tag && !(tag in utags)) tags.push(tag);
                }
                for(let tag of tags) {
                    await finden(tag, level + 1);
                }
            }
        }
        await finden(starttag, 0);
        console.log(Object.keys(utags).map(t => '#' + t).join(' '));
    } finally {
        await driver.quit();
    }
})();