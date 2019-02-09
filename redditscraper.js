const puppeteer = require('puppeteer');
const axios = require('axios');
const Fs = require('fs');
const path = require('path');

function run() {
  var subReddits = [
    'malelivingspace',
    'InteriorDesign',
    'DesignMyRoom',
    'RoomPorn',
    'AmateurRoomPorn',
    'femalelivingspace',
    'TinyHouses',
  ];
  var randomNum = Math.floor(Math.random() * (subReddits.length - 1 - 0) + 0);
  console.log(randomNum);
  return new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(`https://www.reddit.com/r/${subReddits[randomNum]}/`);
      const urls = await page.evaluate(() => {
        const results = [];
        const imageNodes = document.querySelectorAll('img');
        Array.from(imageNodes)
          .filter(imageNode => imageNode.classList.value
            .includes('media-element'))
          .forEach((imageNode) => {
            results.push(
              imageNode.src,
              // text: item.innerText,
            );
          });
        return results;
      });
      browser.close();
      return resolve(urls);
    } catch (e) {
      return reject(e);
    }
  });
}
// run().then(console.log).catch(console.error);
run()
  .then((urls) => {
    Promise.all(urls)
      .then((urls) => {
        var picDir = path.resolve(__dirname, 'pictures/');
        var foo = function (callback) {
          Fs.readdir(picDir, (err, files) => {
            callback(files.length);
          });
        };
        foo((num) => {
          urls.forEach((url) => {
            downloadUrl(url, path.resolve(__dirname, `pictures/${num}.jpg`));
            num++;
          });
        });
      })
  })
  .catch((err) => {
    throw err;
  })

function downloadUrl(src, destination) {
  const writer = Fs.createWriteStream(destination);
  const config = {
    url: src,
    method: 'GET',
    responseType: 'stream',
  };
  axios(config)
    .then((response) => {
      response.data.pipe(writer);
      return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
      });
    })
    .catch((err) => {
      throw new Error(err);
    })
}
