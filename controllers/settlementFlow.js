require('dotenv').config();
const winston = require('winston');
const BigNumber = require('bignumber.js');
const { createSettlement , handleUnsettledTrades, handleNumOfTrades, getTradeSum, getUnsettledTrades } = require('../services/settlement');
const {updateSums} = require('./tradeFlow');
const logger = require('../services/winston');

 

async function settlementFlow(numOfOtc) {

  logger.info(`STARTING SETTLEMENT FLOW. SETTLING ${numOfOtc} OTC TRADES`);
  const unsettledTrades = await getUnsettledTrades();
  const tradesNum = await handleNumOfTrades(unsettledTrades);

  if (tradesNum == numOfOtc) {
    logger.info(`COLLECTED CORRECT AMOUNT OF TRADES FOR SETTLEMENT:
    NUMBER OF TRADES MADE : (${numOfOtc}) 
    NUMBER OF TRADES COLLECTED : (${tradesNum})`)} else {
      logger.info(`COLLECTED INCORRECT AMOUNT OF TRADES FOR SETTLEMENT:
      NUMBER OF TRADES MADE : (${numOfOtc}) 
      NUMBER OF TRADES COLLECTED : (${tradesNum})`)};
    
  let tradeSum = updateSums();
  let settlementSum = await getTradeSum(unsettledTrades);
  // tradeSum = JSON.stringify(tradeSum);
  // tradeSum = JSON.stringify(settlementSum);

  if (tradeSum.base == settlementSum.base && tradeSum.quote == settlementSum.quote ){
    logger.info(`SETTLEMENT TOTAL AMOUNT IS CORRECT`);  
  } else {
    logger.info(`SETTLEMENT TOTAL AMOUNT IS INCORRECT :
          TRADE SUM = ${JSON.stringify(tradeSum)}
          SETTLEMENT COLLECTION SUM = ${JSON.stringify(settlementSum)} `);   }

  const tradesToSettle = await handleUnsettledTrades(unsettledTrades);
  let settMessage = await createSettlement(tradesToSettle);
  logger.info(`${settMessage}`);
  
  const unsettledTradesAfterSettlement = await getUnsettledTrades();
  const tradesToSettleAfterSettlement = await handleUnsettledTrades(unsettledTradesAfterSettlement);

  try {
    tradesToSettleAfterSettlement == 0
    logger.info(`ALL TRADES ARE SETTLED`);
  } catch (error) {
    logger.error(`NOT ALL TRADES ARE SETTLED`);
  }
  

  // if (tradesToSettleAfterSettlement == 0 ) {
  //   logger.info(`ALL TRADES ARE SETTLED`);
  // } 
  
  logger.info(`FINISHED SETTLEMENT FLOW`);
  }


  module.exports = {
  settlementFlow
};
