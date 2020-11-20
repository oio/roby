const axios = require("axios")
const cheerio = require("cheerio")
const puppeteer = require('puppeteer')

const userInstagram = require("user-instagram")

let price = require('crypto-price')
const { GoogleSpreadsheet } = require('google-spreadsheet')

const randomPoemUrl = "https://tofu.wtf/poems/api/random";

// used to read google spreadsheet
// https://theoephraim.github.io/node-google-spreadsheet/
const creds = require('./secrets/roby-google-key.json') 
const doc = new GoogleSpreadsheet('1ek6o7DY5m-4yxdkA8RQJNPY2n-0T1TR7BbP1i23zirQ')

const fetchData = async (site) => {
    const result = await axios.get(site)
    return cheerio.load(result.data)
}

exports.getBTC = async () => {
    const btc = await price.getCryptoPrice("USD", "BTC").then(obj => {         
        return parseFloat(obj.price)        
    }).catch(err => {
        console.log(err)
    })      
    return btc
}

exports.getListeners = async () => {
    const www = "https://stream.oio.radio/"
    const $ = await fetchData(www)
    let listeners = "🔇 oio.radio is off mate!"
    $('.streamstats').each(function( index ) {
        if (index === 1)
            listeners = parseInt($( this ).text())
    })
    return listeners
}

exports.insta = () => {    
  return new Promise(async (resolve, reject) => {
  // Gets informations about a user  
  // const post = await userInstagram('roby.oio') // Same as getUserData()  
  // .then(res => {    
  //   console.log(res.posts[0])
  //   return res.posts[0]
  // })
  // .catch(console.error);
  // return post      
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto("https://instagram.com/roby.oio");
        let post = await page.evaluate(() => {                        
            let posturl = document.getElementsByTagName("article")[0].children[0].querySelector("a").getAttribute("href")
            // let items = document.querySelectorAll('article');
            // items.forEach((item) => {
            //     results.push({
            //         url:  item.getAttribute('href'),
            //         text: item.innerText,
            //     });
            // });        
            const fullUrl = "https://instagram.com" + posturl               
            return fullUrl
        })
        browser.close();
        return resolve(post);
    } catch (e) {
        return reject(e);
    }
  })
}

exports.getRandomPoem = async () => {
    try {
        const response = await axios.get( randomPoemUrl );
        return response.data.content;
    }
    catch (_) {
        return "😢 sorry, no poem 😢"
    }
}

exports.posterize = (wordLetters) => { 
    let num = /([0-9])/;
    let alph = /([a-z])/;
    let string = [];
    Array.from(wordLetters).map((wordSet, i1) => {
      Array.from(wordSet).map((word, i2) => {
        if (word === ' ') {
          string.push(`:small_blue_diamond:`);
        } else if (alph.test(word)) {
          string.push(`:regional_indicator_${word}:`);
        } else if (num.test(word)) {
          for (var i = 0; i < digits.length; i++) {
            if (digits[i] === word) {
              string.push(`:${numbers[i]}:`);
              break;
            }
          }
        }
      });
    });    
    return (string.join(""))
}

