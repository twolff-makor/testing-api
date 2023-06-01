require('dotenv').config();
const axios = require('axios');
const WebSocket = require('ws');
const WS_URL = process.env.WS_URL


async function getUnsettledTrades(TOKEN) {
    ws = new WebSocket(`wss://uat.ws-api.enigma-x.io/?token=${TOKEN}`);
        const dataToSend = JSON.stringify(
            {
                "type": "get_unsettled_trades",
                "id": "dc01e864-f3ed-4d4a-8110-0193f750a917",
                "data": {
                    "company_id": "62b08b48-aaa7-11ed-a122-0a45617894ef"
                }
            })

    ws.on('open', () => {
        console.log('WebSocket connection established - trade');
        setTimeout(() => {
            ws.send(dataToSend);
          }, 1000)
        });
  
    ws.on('message', (data) => {
        const message = data;
        let mess = message.content
        console.log('trafefe fiejifja' + mess);
        const tradeCollections = mess.map(trade => trade.trade_collection);
        console.log(tradeCollections);
        });

      ws.on('close', () => {
          console.log('WebSocket connection closed');
      });
      }




async function createSettlement(TOKEN) {
        TOKEN = TOKEN.slice(1, -1);
        const collectedTrades = await getUnsettledTrades(TOKEN);
        // ws = new WebSocket(`wss://uat.ws-api.enigma-x.io/?token=${TOKEN}`);
            const dataToSend = JSON.stringify(
                {
                    "type": "create_settlement",
                    "data": {
                        "trades_collection": `${collectedTrades}`,
                        "company_id": "62b08b48-aaa7-11ed-a122-0a45617894ef"
                    }
                })
   
        ws.on('open', () => {
            console.log('WebSocket connection established - trade');
            setTimeout(() => {
                ws.send(dataToSend);
              }, 1000)
            });
    
            
        ws.on('message', (data) => {
            const message = JSON.parse(data.toString('utf8'));
            mess = message.content
           console.log(mess);
            });


          ws.on('close', () => {
              console.log('WebSocket connection closed');
          });
          
         
         

    //   } catch (error) {
    //     console.error('An error occurred:', error);
    //   }
   
    
}

module.exports = {
    createSettlement,
  };



