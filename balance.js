require('dotenv').config();
const axios = require('axios');
const WebSocket = require('ws');
const URL = process.env.URL;

async function getBalance(token) {
    token = token.slice(1, -1);
    ws = new WebSocket(`wss://uat.ws-api.enigma-x.io/?token=${token}`);
   const dataToSend = JSON.stringify({
    "id": "038e5af7-3fc8-491b-984e-7ce532757054",
    "type": "balance",
    "data": {
    "show_empty": false,
    "order_by": "amount",
    "sort": "DESC",
    "date": ""
    }
    })

    ws.on('open', () => {
        console.log('WebSocket connection established');
        ws.send(dataToSend);
        });

    const balance = await ws.on('message', (data) => {
        const message = JSON.parse(data.toString('utf8'));
        if (message.content.balance) {
            const response = message.content.balance
            return response;
        } else {}
        });
        
        ws.on('close', () => {
            console.log('WebSocket connection closed');
        });
            
        return balance;

}



module.exports = {
    getBalance
  };



