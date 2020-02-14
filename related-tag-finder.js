const {Builder, By, until} = require('selenium-webdriver');
const _ = require('lodash');

if(process.argv.length < 3) {
    console.log('usage: ' + _.last(process.argv[1].split('/')) + ' <tag>');
    process.exit();
}
let starttag = process.argv[2];
// subject to change
let elid = '._7UhW9 a';

let leveldeep = 1;

(async () => {
    let driver = await new Builder().forBrowser('safari').build();
    try {
        let utags = [];
        let finden = async (tag, level) => {
            await driver.get('https://www.instagram.com/explore/tags/' + tag);
            let taglinks = await driver.wait(until.elementsLocated(By.css(elid)), 10000);
            let tags = [];
            for(let e of taglinks) {
                let tag = (await e.getText()).slice(1);
                if(!utags.includes(tag)) {
                    tags.push(tag);
                    console.log('#' + tag);
                    utags.push(tag);
                }
            }
            if(level < leveldeep) {
                for(let tag of tags) {
                    await finden(tag, level + 1);
                }
            }
        }
        await finden(starttag, 0);
    } finally {
        await driver.quit();
    }
})();