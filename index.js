require('dotenv').config();
const { getToken } = require('./services/auth');
const { createSettlement} = require('./services/settlement');
const { tradeFlow , pause } = require('./controllers/tradeFlows');
const WebSocket = require('ws');



(async () => {

            let numOfOtc = 10;
            
            let TOKEN = await getToken();
            console.log('Token :', TOKEN);    
            ws = new WebSocket(`wss://uat.ws-api.enigma-x.io/?token=${TOKEN}`);
            let gogo = await pause ();

            let trade = await tradeFlow(TOKEN, numOfOtc);
            let popo = await pause();
            await createSettlement(TOKEN)
                  
            
                   })();
            
            
                