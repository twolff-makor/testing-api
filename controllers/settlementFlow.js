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
    
  // let tradeSum = updateSums();
  // tradeSum = JSON.stringify(tradeSum)

  /// GET TRADE SUM, CROSSREFERANCE WITH UPDATESUMS() --------------need to add settlement sum calc
  // let settlementSum = await getTradeSum();
  // console.log(loh);


  // logger.info(`SUM OF TRADE AMOUNT IS CORRECT. DATA :
  //               TRADE SUM = ${tradeSum}
  //               SETTLEMENT COLLECTION SUM = `);
  
  const tradesToSettle = await handleUnsettledTrades(unsettledTrades);
  let settMessage = await createSettlement(tradesToSettle);
  logger.info(`${settMessage}`);
  
  const unsettledTradesSettled = await getUnsettledTrades();
  const tradesToSettleSettled = await handleUnsettledTrades(unsettledTradesSettled);
  logger.info(`ALL TRADES ARE SETTLED: 
                UNSETTLED TRADES = ${tradesToSettleSettled}`);
    
   
  logger.info(`FINISHED SETTLEMENT FLOW.`);
  }


  module.exports = {
  settlementFlow
};
