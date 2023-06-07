require('dotenv').config();
const BigNumber = require('bignumber.js');
const { getCompanyBalance } = require('../services/balance'); 
const { createOtcTrade , generateOtcParams} = require('../services/trade');
const logger = require('../services/winston');
// BigNumber.prototype[require('util').inspect.custom] = BigNumber.prototype.valueOf;

// let createdAllTrades = false; 

async function pause() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
}

async function tradeFlow(numOfOtc) {
  let qtySum = 0;
  let quoteAmountSum = 0;
  logger.info(`STARTING TRADE FLOW. MAKING ${numOfOtc} OTC TRADES`);
      for (let i = 0; i < numOfOtc; i++) {
        const balanceBeforeTrade = await getCompanyBalance();
        const otcParams = generateOtcParams();
        const [base, quote] = otcParams.product.split("-");

        logger.info(`CREATING OTC TRADE NUM ${i+1}. TRADE DATA :
                      SIDE : ${otcParams.side} 
                      COMPANY : TehillaINC
                      PRODUCT : ${otcParams.product} 
                      QTY : ${otcParams.qty}
                      PROVIDER PRICE : ${otcParams.providerPrice}
                      COMPANY PRICE : ${otcParams.companyPrice}`);

        await createOtcTrade(
          otcParams.counterparty,
          otcParams.product,
          otcParams.side,
          otcParams.qty,
          otcParams.providerPrice,
          otcParams.date,
          otcParams.company,
          otcParams.companyPrice,
        );
    
        let time = await pause();
        
        const balanceAfterTrade = await getCompanyBalance();
    
        BigNumber.set({ DECIMAL_PLACES: 0})

        let side = otcParams.side
        let companyPrice = new BigNumber(otcParams.companyPrice)
        let baseAfterTrade = new BigNumber(balanceAfterTrade[base].amount)
        let baseBeforeTrade = new BigNumber(balanceBeforeTrade[base].amount)
        let quoteAfterTrade = new BigNumber(balanceAfterTrade[quote].amount)
        let quoteBeforeTrade = new BigNumber(balanceBeforeTrade[quote].amount)
        
        
        let qty = (new BigNumber(otcParams.qty))
        let baseDelta = (new BigNumber(baseBeforeTrade.minus(baseAfterTrade)))
        let quoteDelta = (new BigNumber(quoteAfterTrade.minus(quoteBeforeTrade)))
        let quoteAmount = (new BigNumber(qty.multipliedBy(companyPrice)))
        
        
        logger.info(`COMPARING BALANCES - COMPANY SIDE.
        QUOTE BALANCE BEFORE TRADE : ${quoteBeforeTrade} 
        QUOTE BALANCE AFTER TRADE : ${quoteAfterTrade}
        BASE BALANCE BEFORE TRADE : ${baseBeforeTrade} 
        BASE BALANCE AFTER TRADE : ${baseAfterTrade} `);
        
        qty = qty.integerValue()
        baseDelta = baseDelta.integerValue()
        quoteDelta = quoteDelta.integerValue()
        quoteAmount = quoteAmount.integerValue()
        
        if (side == "BUY") {
            if (baseDelta.isEqualTo(qty) && quoteDelta.isEqualTo(quoteAmount)) {
              qtySum += qty.toNumber();
              console.log(`qty : ${qty} quote :${quoteAmount}===================================`);

              quoteAmountSum += quoteAmount.toNumber();
              // console.log(`qty : ${qty} quote :${quoteAmount}===================================`);
              logger.info(`BALANCE IS CORRECT.`);
            } else {
              logger.info(`BALANCE IS INCORRECT. QTY: ${qty}, BASE DELTA: ${baseDelta}, QUOTE DELTA: ${quoteDelta}, QUOTE QTY: ${quoteAmount}`);
            }
        } else if (side == "SELL") {
            qty = qty.multipliedBy(-1)
            quoteAmount = quoteAmount.multipliedBy(-1)
            console.log(qty)
            qtySum += qty.toNumber();
            quoteAmountSum += quoteAmount.toNumber();
            console.log(`qty : ${qty} quote :${quoteAmount}!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
            if (baseDelta.isEqualTo(qty) && quoteDelta.isEqualTo(quoteAmount)) {
              logger.info(`BALANCE IS CORRECT.`);
           } else {
            logger.info(`BALANCE IS INCORRECT. QTY: ${qty}, BASE DELTA: ${baseDelta}, QUOTE DELTA: ${quoteDelta}, QUOTE QTY: ${quoteAmount}`);
           }
        }
      }
      logger.info(`FINISHED TRADE FLOW. MADE ${numOfOtc} OTC TRADES`);
    }
    
    
module.exports = {
    tradeFlow,
    pause,
    // qtySum, 
    // quoteAmountSum,
  };