require('dotenv').config();
const axios = require('axios');
const WebSocket = require('ws');
const WS_URL = process.env.WS_URL

const counterparties = ['04ea951e-3457-11ed-9f51-9c7bef452f5f',]
const products = [{name: 'USDT-USD', lowPrice: 26000, highPrice: 29000, lowQty: 1, highQty: 1000, decimals: 2},
                {name: 'BTC-USD', lowPrice: 26000, highPrice: 29000, lowQty: 0.0001, highQty: 20, decimals: 2},
                {name: 'BTC-USDT', lowPrice: 26000, highPrice: 29000, lowQty: 0.0001, highQty: 20, decimals: 2},
                {name: 'USDT-USDC', lowPrice: 26000, highPrice: 29000, lowQty: 1, highQty: 1000, decimals: 2},
                {name: 'USDC-USD', lowPrice: 26000, highPrice: 29000, lowQty: 1, highQty: 1000, decimals: 2},
                {name: 'BTC-USDC', lowPrice: 26000, highPrice: 29000, lowQty: 0.0001, highQty: 20, decimals: 2},
                {name: 'BTC-EUR', lowPrice: 26000, highPrice: 29000, lowQty: 0.0001, highQty: 20, decimals: 2},
                {name: 'TUSD-USDT', lowPrice: 26000, highPrice: 29000, lowQty:1, highQty: 1000, decimals: 2},
                {name: 'ETH-USD', lowPrice: 26000, highPrice: 29000, lowQty: 0.001, highQty: 100, decimals: 2},
                {name: 'BTC-GBP', lowPrice: 26000, highPrice: 29000, lowQty: 0.0001, highQty: 20, decimals: 2},
                {name: 'USDT-GBP', lowPrice: 26000, highPrice: 29000, lowQty: 1, highQty: 1000, decimals: 2},
                {name: 'USDC-EUR', lowPrice: 26000, highPrice: 29000, lowQty: 1, highQty: 1000, decimals: 2},
                {name: 'ADA-USD', lowPrice: 26000, highPrice: 29000, lowQty: 1, highQty: 2000, decimals: 2},
                {name: 'BUSD-USD', lowPrice: 26000, highPrice: 29000, lowQty: 1, highQty: 1000, decimals: 2},
                {name: 'ETH-EUR', lowPrice: 26000, highPrice: 29000, lowQty: 0.001, highQty: 100, decimals: 2},
                {name: 'TRX-USD', lowPrice: 26000, highPrice: 29000, lowQty: 2, highQty: 4000, decimals: 2},
                {name: 'USDT-CAD', lowPrice: 26000, highPrice: 29000, lowQty: 1, highQty: 1000, decimals: 2},
                {name: 'XLM-USD', lowPrice: 26000, highPrice: 29000, lowQty: 2, highQty: 4000, decimals: 2},
                {name: 'USDT-EUR', lowPrice: 26000, highPrice: 29000, lowQty: 1, highQty: 100, decimals: 2},]
const sides = ['BUY','SELL']
const companies = ['62b08b48-aaa7-11ed-a122-0a45617894ef']

function getRandomItem(array) {
    let item = array[Math.floor(Math.random() * array.length)]
    return item;
}

function getRandomNumber(min, max, decimals) {
    const randomNumber = Math.random() * (max - min) + min; 
    const roundedNumber = randomNumber.toFixed(decimals); 
    return roundedNumber; // parseFloat?
}

function addFee(num, isPlus, number) {
    const basisPoints = amount / 10000;
    const adjustment = isPlus ? number * basisPoints : -number * basisPoints;
    const result = number + adjustment;
    return result;
  }

function getIsoDate() {
    const now = new Date();
    const formattedDateTime = now.toISOString();
    return formattedDateTime; 
}

function generateOtcParams() {
        let side = getRandomItem(sides)
        let counterparty = getRandomItem(counterparties)
        let company = getRandomItem(companies)
        let productsIndex = products[Math.floor(Math.random() * products.length)]
        let qty = getRandomNumber(productsIndex.lowQty ,productsIndex.highQty, productsIndex.decimals)
        let product = productsIndex.name
        let providerPrice = getRandomNumber(productsIndex.lowPrice,productsIndex.highPrice, productsIndex.decimals)
        let companyPrice = side === 'BUY' ? providerPrice * (1 + 5/ 10000) : providerPrice * (1 - 5/ 10000)
        let date = getIsoDate();
        let params = [counterparty, product, side, qty, providerPrice, date, company, companyPrice]
        return params;
    }



async function createOtcTrade(TOKEN, counterparty, product, side, qty, providerPrice, date, company, companyPrice) {
    try {
        TOKEN = TOKEN.slice(1, -1);
        ws = new WebSocket(`wss://uat.ws-api.enigma-x.io/?token=${TOKEN}`);
            const dataToSend = JSON.stringify(
                {"group": "otc",
                "type": "report_trade_otc",
                "data": {
                    "providers_trades": [
                        {
                            "counterparty": `${counterparty}`,
                            "user": "3331a59b-a2c4-11ed-a122-0a45617894ef",
                            "product": `${product}`,
                            "side": `${side}`,
                            "status": "VALIDATED",
                            "quantity":`${qty}`,
                            "type": "MANUAL FILL",
                            "price": `${providerPrice}`,
                            "comment": "",
                            "executed_at": `${date}`
                        }
                    ],
                    "trade_company": {
                        "counterparty": `${company}`,
                        "product": `${product}`,
                        "side": `${side}`,
                        "status": "VALIDATED",
                        "quantity": `${qty}`,
                        "type": "MANUAL FILL",
                        "price": `${companyPrice}`,
                        "comment": "",
                        "executed_at": `${date}`
                    },
                    "otc_type": "PAIRED"
                }
            })
            console.log(dataToSend);
   
        ws.on('open', () => {
            console.log('WebSocket connection established');
            ws.send(dataToSend);
            });
    
        const response = await ws.on('message', (data) => {
            const message = JSON.parse(data.toString('utf8'));
            if (message.content) {
                console.log(message.content)
            } else {}
          });

          ws.on('close', () => {
              console.log('WebSocket connection closed');
          });
          
          return response;

      } catch (error) {
        console.error('An error occurred:', error);
      }
   
    
}

module.exports = {
    createOtcTrade,
    generateOtcParams
  };



