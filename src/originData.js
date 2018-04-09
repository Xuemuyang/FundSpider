const fs = require('fs');

function getFundCodeArr() {
    let fundCodeArr = [];

    fs.readFile('./fundcode.html', 'utf-8', (err, data) => {
        fundCodeArr = data.match(/\d{6}/g);
    });

}