require('dotenv').config();
const WebSocket = require('ws');
const WS_URL = process.env.WS_URL;


async function getCompanyBalance(TOKEN) {
  return new Promise((resolve, reject) => {
    TOKEN = TOKEN.slice(1, -1);
    
    let ws;
      if (!ws) {
          ws = new WebSocket(`${WS_URL}/?token=${TOKEN}`);
      }
    
      const dataToSend = JSON.stringify({
        "id": "88d594c9-5bd6-489e-9ee9-d70c6c0fb73b",
        "type": "balance",
        "data": {
            "show_empty": true,
            "order_by": "amount",
            "sort": "DESC",
            "date": "",
            "company": "62b08b48-aaa7-11ed-a122-0a45617894ef"
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
          // console.log(message);
          if (message) {
            const balance = message.content.balance
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
    getCompanyBalance
  };



