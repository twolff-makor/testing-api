require('dotenv').config();
const winston = require('winston');
const { getWsToken, getRestToken} = require('./services/auth');
const { openWebSocket } = require('./services/websocket');
const { createSettlement} = require('./services/settlement');
const { tradeFlow , pause } = require('./controllers/tradeFlows');

let numOfOtc = 5;

(async () => {
            let REST_TOKEN = await getRestToken();
            let WS_TOKEN = await getWsToken();
            let connection = await openWebSocket(`${process.env.WS_URL}/?token=${WS_TOKEN}`)

            if (connection) {
                   let trade = await tradeFlow(numOfOtc);
                   let settlement = await createSettlement(numOfOtc)
                   // let coco = await pause();
                   // getCompanyBalance()
                   // createSettlement();
            }
      
                   })();
            
            