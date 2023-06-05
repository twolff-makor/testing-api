require('dotenv').config();
const winston = require('winston');
const BigNumber = require('bignumber.js');
const { getCompanyBalance } = require('../services/balance'); 
const { createOtcTrade , generateOtcParams} = require('../services/trade');
// BigNumber.prototype[require('util').inspect.custom] = BigNumber.prototype.valueOf;

// let createdAllTrades = false; 


async function pause() {
    await new Promise((resolve) => setTimeout(resolve, 500));
}

async function tradeFlow(numOfOtc) {
      for (let i = 0; i < numOfOtc; i++) {
            console.log(i);
        const balanceBeforeTrade = await getCompanyBalance();
        console.log(`i am balance before trade ${balanceBeforeTrade}`);
        const otcParams = generateOtcParams();
        const [base, quote] = otcParams[1].split("-");
        await createOtcTrade(
          otcParams[0],
          otcParams[1],
          otcParams[2],
          otcParams[3],
          otcParams[4],
          otcParams[5],
          otcParams[6],
          otcParams[7],
        );
    
        let time = await pause();
        let tine = await pause();
        
        const balanceAfterTrade = await getCompanyBalance();
    
        BigNumber.set({ DECIMAL_PLACES: 0})

        let side = otcParams[2]
        let qty = new BigNumber(otcParams[3])
        let companyPrice = new BigNumber(otcParams[7])
        let baseAfterTrade = new BigNumber(balanceAfterTrade[base].amount)
        let baseBeforeTrade = new BigNumber(balanceBeforeTrade[base].amount)
        let quoteAfterTrade = new BigNumber(balanceAfterTrade[quote].amount)
        let quoteBeforeTrade = new BigNumber(balanceBeforeTrade[quote].amount)

        let baseDelta = new BigNumber(baseAfterTrade.minus(baseBeforeTrade));
        let quoteDelta = new BigNumber(quoteBeforeTrade.minus(quoteAfterTrade));
        let quoteAmount = new BigNumber(qty.multipliedBy(companyPrice));
    
        if (side == "BUY") {
          if (baseDelta === qty && quoteDelta === quoteAmount) {
            console.log('balance is correct');
          } else {
            console.log(`balance is not correct, side: ${side}, qty: ${qty}, company price: ${companyPrice}, base delta: ${baseDelta}, quote delta: ${quoteDelta}, quote amount: ${quoteAmount}`);
          }
        } else if (side == "SELL") {
            qty = qty.multipliedBy(-1)
            quoteAmount = quoteAmount.multipliedBy(-1)
            console.log(`before , side: ${side}, qty: ${qty}, base delta: ${baseDelta}, quote delta: ${quoteDelta}, quote amount: ${quoteAmount}`);
          if (baseDelta.isEqualTo(qty) && quoteDelta.isEqualTo(quoteAmount)) {
            console.log('balance is correct');
          } else {
            console.log(`balance is not correct, side: ${side}, qty: ${qty}, company price: null, base delta: ${baseDelta}, quote delta: ${quoteDelta}, quote amount: ${quoteAmount}`);
          }
        } else {
          console.log("Side is not buy or sell");
        }
      }

    }
    
    
module.exports = {
    tradeFlow,
    pause,
  };
