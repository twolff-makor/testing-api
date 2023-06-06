require('dotenv').config();
const WebSocket = require('ws');
const WS_URL = process.env.WS_URL

let tradesCollected = false;
let ws;

async function getUnsettledTrades(TOKEN) {
    return new Promise((resolve, reject) => {
        if (!ws) {
            ws = new WebSocket(`${WS_URL}/?token=${TOKEN}`);
        }

        const dataToSend = JSON.stringify({
            "type": "get_unsettled_trades",
            "id": "dc01e864-f3ed-4d4a-8110-0193f750a917",
            "data": {
                "company_id": "62b08b48-aaa7-11ed-a122-0a45617894ef"
            }
        });

        ws.on('open', () => {
            console.log('WebSocket connection established - get unsettled trades');
            ws.send(dataToSend);
        });

        ws.on('message', (data) => {
            if (tradesCollected === false) {
                const response = JSON.parse(data.toString('utf8'));
                const message = response.content?.unsettled_trades || '';
                console.log(message)
                const tradeCollections = message.map(item => item.trade_collection);
                resolve(tradeCollections);
                tradesCollected = true;
            } else {return}
        });

    });
}



async function createSettlement(TOKEN) {
        TOKEN = TOKEN.slice(1, -1);
        const collectedTrades = await getUnsettledTrades(TOKEN);
        console.log(collectedTrades);
        const dataToSend = JSON.stringify(
            {
                "type": "create_settlement",
                "data": {"trades_collection": collectedTrades,
                        "company_id": "62b08b48-aaa7-11ed-a122-0a45617894ef"
                }
            });
        console.log(dataToSend);

        if (dataToSend) {
            ws.send(dataToSend);
        }
            
        ws.on('message', (data) => {
            const response = JSON.parse(data.toString('utf8'));
            const message = response.content?.unsettled_trades || [];
            mess = message
            console.log(mess);
            });


          ws.on('close', () => {
              console.log('WebSocket connection closed');
          });
        }
         


module.exports = {
    createSettlement,
  };



