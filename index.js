require('dotenv').config();
const { getToken } = require('./services/auth');
const { createSettlement} = require('./services/settlement');
const { tradeFlow , pause } = require('./controllers/tradeFlows');


(async () => {

            let numOfOtc = 10;
            
            let TOKEN = await getToken();
            console.log('Token :', TOKEN);    
            
            
            let trade = await tradeFlow(TOKEN, numOfOtc);
            let popo = await pause();
            await createSettlement(TOKEN)
                  
            
                   })();
            
            
                