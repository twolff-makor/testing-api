require('dotenv').config();
const axios = require('axios');
const WebSocket = require('ws');
const URL = process.env.URL;


async function getBalance(TOKEN) {
    return new Promise((resolve, reject) => {
      TOKEN = TOKEN.slice(1, -1);
      const ws = new WebSocket(`wss://uat.ws-api.enigma-x.io/?token=${TOKEN}`);
    
      const dataToSend = JSON.stringify({
        "id": "038e5af7-3fc8-491b-984e-7ce532757054",
        "type": "balance",
        "data": {
          "show_empty": false,
          "order_by": "amount",
          "sort": "DESC",
          "date": ""
        }
      });
    
      ws.on('open', () => {
        try {
          ws.send(dataToSend);
        } catch (error) {
          console.log('Error occurred while sending data:', error);
        }
      });     
    
      ws.on('message', (data) => {
        try {   
          const message = JSON.parse(data.toString('utf8'));
          if (message) {
            const balance = message.content.balance
            // console.log(balance);
            resolve(balance);
            // ws.close();
          } else {
            console.log('No response received');
          }
        } catch (error) {
          console.log('Error occurred while processing message:', error);
        }
      });

    ws.on('close', () => {
        console.log('WebSocket connection closed');
    });

    ws.on('error', () => {
        reject(error);
      });
    });       
}



module.exports = {
    getBalance
  };



