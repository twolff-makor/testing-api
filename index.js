require('dotenv').config();
const { getToken } = require('./controllers/auth');
const { getBalance } = require('./controllers/balance'); 
const { createOtcTrade , generateOtcParams} = require('./controllers/trade');
const { createSettlement} = require('./controllers/settlement');

let numOfOtc = 10;

(async () => {
      let TOKEN = await getToken();
      console.log('Token :', TOKEN);    
      
      
      balanceBeforeTrade = await getBalance(TOKEN);
      console.log(`Balancebeforetrade :${balanceBeforeTrade}`)

      let otcParams = await generateOtcParams();
      // const [base, quote] = otcParams[1].split("-");
      await createOtcTrade(TOKEN, otcParams[0],otcParams[1],otcParams[2],otcParams[3],otcParams[4],otcParams[5],otcParams[6],otcParams[7]);
    
      // createSettlement(TOKEN)

      balanceAfterTrade = await getBalance(TOKEN);
      console.log(`Balanceaftertrade :${balanceAfterTrade}`)
    
       })();
  
  
  // if (otcParams[2] === 'BUY') {
  //   let baseDelta = (balanceAfterTrade[base].amount) - (balanceBeforeTrade[base].amount) 
  //   let quoteDelta = (balanceBeforeTrade[quote].amount) - (balanceAfterTrade[quote].amount)
  //   let quoteAmmount = ( -1 * (otcParams[3] * ))
  //   if (baseDelta === otcParams[3] && quoteDelta === otcParams[3]){

  //   }
  // } if (otcParams[2] === 'SELL'){

  // } else {console.log("Side is not buy or sell")}


  