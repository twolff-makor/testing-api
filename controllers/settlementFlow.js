require('dotenv').config();
const winston = require('winston');
const { createSettlement , getUnsettledTrades, handleNumOfTrades } = require('../services/settlement');
const logger = require('../services/winston');

 

async function settlementFlow(numOfOtc) {
    logger.info(`STARTING SETTLEMENT FLOW. SETTLING ${numOfOtc} OTC TRADES`);
          const unsettledTrades = await getUnsettledTrades(numOfOtc);

          const tradesNum = await handleNumOfTrades(unsettledTrades);
          if (tradesNum == numOfOtc) {
            logger.info(`COLLECTED CORRECT AMOUNT OF TRADES FOR SETTLEMENT:
            NUMBER OF TRADES MADE : (${numOfOtc}) 
            NUMBER OF TRADES COLLECTED : (${tradesNum})`)}

        //   logger.info(`CREATING NEW SETTLEMENT ${i+1}. TRADE DATA :
        //                 SIDE : ${otcParams.side} 
        //                 COMPANY : TehillaINC
        //                 PRODUCT : ${otcParams.product} 
        //                 QTY : ${otcParams.qty}
        //                 PROVIDER PRICE : ${otcParams.providerPrice}
        //                 COMPANY PRICE : ${otcParams.companyPrice}`);
      
        //   let time = await pause();
      
        //   BigNumber.set({ DECIMAL_PLACES: 0})
  
        //   let side = otcParams.side
        //   let companyPrice = new BigNumber(otcParams.companyPrice)
        //   let baseAfterTrade = new BigNumber(balanceAfterTrade[base].amount)
        //   let baseBeforeTrade = new BigNumber(balanceBeforeTrade[base].amount)
        //   let quoteAfterTrade = new BigNumber(balanceAfterTrade[quote].amount)
        //   let quoteBeforeTrade = new BigNumber(balanceBeforeTrade[quote].amount)
          
          
        //   let qty = (new BigNumber(otcParams.qty))
        //   let baseDelta = (new BigNumber(baseAfterTrade.minus(baseBeforeTrade)))
        //   let quoteDelta = (new BigNumber(quoteBeforeTrade.minus(quoteAfterTrade)))
        //   let quoteAmount = (new BigNumber(qty.multipliedBy(companyPrice)))
          
          
        //   logger.info(`COMPARING BALANCES - COMPANY SIDE.
        //   QUOTE BALANCE BEFORE TRADE : ${quoteBeforeTrade} 
        //   QUOTE BALANCE AFTER TRADE : ${quoteAfterTrade}
        //   BASE BALANCE BEFORE TRADE : ${baseBeforeTrade} 
        //   BASE BALANCE AFTER TRADE : ${baseAfterTrade} `);
          
        //   qty = qty.integerValue()
        //   baseDelta = baseDelta.integerValue()
        //   quoteDelta = quoteDelta.integerValue()
        //   quoteAmount = quoteAmount.integerValue()
          
        //   if (side == "BUY") {
        //       if (baseDelta.isEqualTo(qty) && quoteDelta.isEqualTo(quoteAmount)) {
        //         qtySum += qty.toNumber();
        //         console.log(`qty : ${qty} quote :${quoteAmount}===================================`);
  
        //         quoteAmountSum += quoteAmount.toNumber();
        //         console.log(`qty : ${qty} quote :${quoteAmount}===================================`);
        //         logger.info(`BALANCE IS CORRECT.`);
        //       } else {
        //         logger.info(`BALANCE IS INCORRECT. QTY: ${qty}, BASE DELTA: ${baseDelta}, QUOTE DELTA: ${quoteDelta}, QUOTE QTY: ${quoteAmount}`);
        //       }
        //   } else if (side == "SELL") {
        //       qty = qty.multipliedBy(-1)
        //       quoteAmount = quoteAmount.multipliedBy(-1)
        //       console.log(qty)
        //       qtySum += qty.toNumber();
        //       quoteAmountSum += quoteAmount.toNumber();
        //       console.log(`qty : ${qty} quote :${quoteAmount}!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
        //       if (baseDelta.isEqualTo(qty) && quoteDelta.isEqualTo(quoteAmount)) {
        //         logger.info(`BALANCE IS CORRECT.`);
        //      } else {
        //       logger.info(`BALANCE IS INCORRECT. QTY: ${qty}, BASE DELTA: ${baseDelta}, QUOTE DELTA: ${quoteDelta}, QUOTE QTY: ${quoteAmount}`);
        //      }
        //   }
          logger.info(`FINISHED SETTLEMENT FLOW.`);
        }

module.exports = {
  settlementFlow
};
