require('dotenv').config();
const winston = require('winston');
const { sendWebSocketMessage, setMessageHandler } = require('./websocket');
// const BigNumber = require('bignumber.js');

function handleSettlementMessage(message) {
  if (message.code = 200 && message.content) {
    const settlementId = message.content.settlement_id 
    return (`NEW SETTLEMENT CREATED, SETTLEMENT ID ${settlementId}`)
  } else {}
}

// async function getTradeSum() {
//   const data = await getUnsettledTrades();
//   const unsettledTrades = data.content.unsettled_trades
//   const sumLegsByCurrency = {};
//   // return new Promise((resolve, reject) => {
//     const sumOfTrades = unsettledTrades.map((item) => {
//       const [base, quote] = item.product?.split('-');
// 			const baseAmount = new BigNumber(item.legs[base].amount).integerValue();
// 			const quoteAmount = new BigNumber(item.legs[quote].amount)

// 			sumLegsByCurrency[base] = new BigNumber((sumLegsByCurrency[base] ?? 0).toString()).plus(baseAmount.toString())
// 			sumLegsByCurrency[quote] = new BigNumber((sumLegsByCurrency[quote] ?? 0).toString()).plus(quoteAmount.toString())

//         // });


//       // const trades = data.content?.unsettled_trades || '';
//       // let tradesNum = 0;
//       // for (const trade of trades) {
//       //   console.log(tradesNum);
//       // tradesNum += trade.trades;
      
//       // }
//       // resolve(sumOfTrades);
//     });
//     return sumLegsByCurrency;
// }

async function handleNumOfTrades(data) {
  return new Promise((resolve, reject) => {
      const trades = data.content?.unsettled_trades || [];
      let tradesNum = 0;
      for (const trade of trades) {
      tradesNum += trade.trades;
      }
      resolve(tradesNum);
  });
}

async function handleUnsettledTrades(data) {
  return new Promise((resolve, reject) => {
      const trades = data.content?.unsettled_trades || [];
      const tradeCollections = trades.map(item => item.trade_collection);
      resolve(tradeCollections);
  });
}

async function getUnsettledTrades() {
  return new Promise((resolve, reject) => {
  const dataToSend = JSON.stringify({
    "type": "get_unsettled_trades",
    "id": "dc01e864-f3ed-4d4a-8110-0193f750a917",
    "data": {
      "company_id": "62b08b48-aaa7-11ed-a122-0a45617894ef"
    }
  });
  sendWebSocketMessage(dataToSend);
  setMessageHandler(resolve);
});
}

async function createSettlement(collectedTrades) {
  return new Promise((resolve, reject) => {
  const dataToSend = JSON.stringify({
    "type": "create_settlement",
    "data": {
      "trades_collection": collectedTrades,
      "company_id": "62b08b48-aaa7-11ed-a122-0a45617894ef"
    }
  });

  sendWebSocketMessage(dataToSend);
  const response = setMessageHandler(handleSettlementMessage);
  resolve(response)});
}

module.exports = {
  createSettlement,
  handleUnsettledTrades, 
  handleNumOfTrades,
  getUnsettledTrades,
  // getTradeSum
};





// async function getTradeSum() {
//   const data = await getUnsettledTrades();
//   const sumByType = {base: 0 , quote: 0};
//   const sumLegsByCurrency = {};
  
//   return new Promise((resolve, reject) => {
//   // const sumLegsByCurrency = {};
//   const sumOfTrades = data.content.unsettled_trades.map((item) => {
//     const [base, quote] = item.product?.split('-');
//     const baseAmount = (new BigNumber(item.legs[base].amount)).integerValue();
//     const quoteAmount = (new BigNumber(item.legs[quote].amount)).integerValue();
//     sumByType.base =+ baseAmount;
//     sumByType.quote =+ quoteAmount;
//     sumLegsByCurrency[base] = new BigNumber((sumLegsByCurrency[base] ?? 0)).plus((baseAmount).integerValue())
//     sumLegsByCurrency[quote] = new BigNumber((sumLegsByCurrency[quote] ?? 0)).plus((quoteAmount).integerValue())
//   });
//   resolve(JSON.stringify(sumLegsByCurrency));
// });
//   }