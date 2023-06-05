require('dotenv').config();
const { getCompanyBalance } = require('../services/balance'); 
const { createOtcTrade , generateOtcParams} = require('../services/trade');

async function pause() {
    await new Promise((resolve) => setTimeout(resolve, 500));
}

async function tradeFlow(TOKEN, numOfOtc) {
      for (let i = 0; i < numOfOtc; i++) {
        const balanceBeforeTrade = await getCompanyBalance(TOKEN);
    
        let otcParams = generateOtcParams();
        const [base, quote] = otcParams[1].split("-");
        await createOtcTrade(
          TOKEN,
          otcParams[0],
          otcParams[1],
          otcParams[2],
          otcParams[3],
          otcParams[4],
          otcParams[5],
          otcParams[6],
          otcParams[7]
        );
    
        let time = await pause();
        const balanceAfterTrade = await getCompanyBalance(TOKEN);
    
        let side = otcParams[2];
        let qty = otcParams[3];
        let companyPrice = otcParams[7];
        let baseDelta = balanceAfterTrade[base].amount - balanceBeforeTrade[base].amount;
        let quoteDelta = balanceBeforeTrade[quote].amount - balanceAfterTrade[quote].amount;
        let quoteAmount = -1 * qty * companyPrice;
    
        if (side == "BUY") {
          if (baseDelta === qty && quoteDelta === quoteAmount) {
            console.log('balance is correct');
          } else {
            console.log(`balance is not correct, side: ${side}, qty: ${qty}, company price: ${companyPrice}, base delta: ${baseDelta}, quote delta: ${quoteDelta}, quote amount: ${quoteAmount}`);
          }
        } else if (side == "SELL") {
          if (baseDelta === -qty && quoteDelta === -quoteAmount) {
            console.log('balance is correct');
          } else {
            console.log(`balance is not correct, side: ${side}, qty: ${qty}, company price: ${companyPrice}, base delta: ${baseDelta}, quote delta: ${quoteDelta}, quote amount: ${quoteAmount}`);
          }
        } else {
          console.log("Side is not buy or sell");
        }
      }
    }
    
    
module.exports = {
    tradeFlow,
    pause
  };
