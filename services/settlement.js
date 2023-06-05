require('dotenv').config();
const winston = require('winston');
const {sendWebSocketMessage, setMessageHandler } = require('./websocket');

let tradesCollected = false; 
let createdSettlement = false; 

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

async function getUnsettledTrades() {
    const dataToSend = JSON.stringify({
      "type": "get_unsettled_trades",
      "id": "dc01e864-f3ed-4d4a-8110-0193f750a917",
      "data": {
        "company_id": "62b08b48-aaa7-11ed-a122-0a45617894ef"
      }
    });
  
    if (tradesCollected == false) {
        return new Promise((resolve, reject) => {
        setMessageHandler((data) => {
          const tradeCollections = handleUnsettledTrades(data);
          resolve(tradeCollections);
        });
        sendWebSocketMessage(dataToSend);
      });
    }
  }
  
  async function createSettlement() {
    const collectedTrades = await getUnsettledTrades();
    const dataToSend = JSON.stringify({
      "type": "create_settlement",
      "data": {
        "trades_collection": collectedTrades,
        "company_id": "62b08b48-aaa7-11ed-a122-0a45617894ef"
      }
    });
  
    if (createdSettlement == false) {
        return new Promise((resolve, reject) => {
            setMessageHandler(console.log);
            sendWebSocketMessage(dataToSend);
            createdSettlement = true;
      });
    }
  }
  
  
module.exports = {
    createSettlement
};



