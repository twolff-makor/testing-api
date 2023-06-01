require('dotenv').config();
const { getToken } = require('./controllers/auth');
const { getBalance } = require('./controllers/balance'); 
const { createOtcTrade , generateOtcParams} = require('./controllers/trade');

let numOfOtc = 10;

(async () => {
  try {
      let TOKEN = await getToken();
      console.log('Token :', TOKEN);    
      
    // for (i = 0 ; i++ ; i < 10) {
      balanceBeforeTrade = await JSON.stringify(getBalance(TOKEN));
      console.log(`Balancebeforetrade :${balanceBeforeTrade}`)
      
      // const otcParams = await generateOtcParams();
      // const [baseProduct, baseCurrency] = otcParams[1].split("-");
      // createOtcTrade(TOKEN, otcParams[0],otcParams[1],otcParams[2],otcParams[3],otcParams[4],otcParams[5],otcParams[6],otcParams[7])

      balanceAfterTrade = await JSON.stringify(getBalance(TOKEN));
      console.log(`Balanceaftertrade :${balanceAfterTrade}`)
    // }
      
  } catch (error) {
    console.error('An error occurred:', error);
  }
    })();

