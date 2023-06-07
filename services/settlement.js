require('dotenv').config();
const winston = require('winston');
const { sendWebSocketMessage, setMessageHandler } = require('./websocket');

let tradesCollected = false;
// let createdSettlement = false;

async function handleNumOfTrades(data) {
  return new Promise((resolve, reject) => {
    if (tradesCollected == false) {
      const trades = data.content?.unsettled_trades || '';
      let tradesNum = 0;
      for (const trade of trades) {
      tradesNum += trade.trades;
        }

    // if (tradeSum == numOfOtc ) {
    //     console.log(`trades created is equal to ammount if trades in create settlement`);
    //     tradeSum = true;
      resolve(tradesNum);
      }
    // }
  });
}

async function handleUnsettledTrades(data) {
  return new Promise((resolve, reject) => {
    if (tradesCollected == false) {
      const trades = data.content?.unsettled_trades || '';
      const tradeCollections = trades.map(item => item.trade_collection);
      tradesCollected = true;
      resolve(tradeCollections);
    }
  });
}

async function getUnsettledTrades(numOfOtc) {
  const dataToSend = JSON.stringify({
    "type": "get_unsettled_trades",
    "id": "dc01e864-f3ed-4d4a-8110-0193f750a917",
    "data": {
      "company_id": "62b08b48-aaa7-11ed-a122-0a45617894ef"
    }
  });

    return new Promise((resolve, reject) => {
      setMessageHandler(async (data) => {
       
        const tradeCollections = await handleUnsettledTrades(data);
        resolve(tradeCollections);
      });
      sendWebSocketMessage(dataToSend);
    });
}

async function createSettlement(collectedTrades) {
  const dataToSend = JSON.stringify({
    "type": "create_settlement",
    "data": {
      "trades_collection": collectedTrades,
      "company_id": "62b08b48-aaa7-11ed-a122-0a45617894ef"
    }
  });

    return new Promise((resolve, reject) => {
      setMessageHandler(console.log);
      sendWebSocketMessage(dataToSend);
    });

}

module.exports = {
  createSettlement,
  getUnsettledTrades, 
  handleNumOfTrades,
};
