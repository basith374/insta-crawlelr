var fs = require('fs');
const {Builder, By, until} = require('selenium-webdriver');

require.extensions['.csv'] = (module, filename) => {
    module.exports = fs.readFileSync(filename, 'utf8');
}

/**
 * csv format
 * column heading expected
 * first column is for tags
 */

let csv = require('./tags.csv');

let rows = csv.split('\n');

// subject to change
let elid = 'g47SY';

(async () => {
    let driver = await new Builder().forBrowser('safari').build();
    try {
        for(let row of rows.slice(1)) {
            let tag = row.split(',')[0].slice(1);
            await driver.get('https://www.instagram.com/explore/tags/' + tag);
            let count = await driver.wait(until.elementLocated(By.className(elid)), 10000).getText();
            console.log(tag, count);
        }
    } finally {
        await driver.quit();
    }
})();