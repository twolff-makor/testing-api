require('dotenv').config();
const winston = require('winston');
const { getWsToken, getRestToken} = require('./services/auth');
const { openWebSocket } = require('./services/websocket');
const { settlementFlow } = require('./controllers/settlementFlow');
const { tradeFlow, pause } = require('./controllers/tradeFlow');

let numOfOtc = 100;

(async () => {
            let REST_TOKEN = await getRestToken();
            let WS_TOKEN = await getWsToken();
            let connection = await openWebSocket(`${process.env.WS_URL}/?token=${WS_TOKEN}`)

            if (connection) {
              (async () => {
                     let trade = await tradeFlow(numOfOtc);
                     let settlement = await settlementFlow(numOfOtc)
         
              })();
            }
      
                   })();
           
            