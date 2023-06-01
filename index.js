require('dotenv').config();
const { getToken } = require('./auth');
const { getBalance } = require('./balance'); 
const { createOtcTrade , generateOtcParams} = require('./trade');



(async () => {
      TOKEN = await getToken();
      console.log('Token :', TOKEN);    
      
      // balance = await getBalance(TOKEN);
      // console.log('Balance :', balance)
      
      let otcParams = generateOtcParams()
      Creates = await createOtcTrade(TOKEN)
      console.log(JSON.stringify(Creates))

    })();

