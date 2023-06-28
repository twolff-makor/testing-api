require('dotenv').config();
const winston = require('winston');
const { getWsToken, getRestToken } = require('./services/auth');
const { openWebSocket } = require('./services/websocket');
const { settlementFlow } = require('./controllers/settlementFlow');
const { tradeFlow, pause } = require('./controllers/tradeFlow');
const { companyFlow } = require('./controllers/companyFlow');

const WS_URL = process.env.ENV === 'DEV' ? process.env.DEV_WS_URL : process.env.UAT_WS_URL;

// enter a number between 1 and 50 (can handle more but will take a while to run)
let numOfOtc = 10;

(async () => {
	const REST_TOKEN = await getRestToken();
	//      let WS_TOKEN = await getWsToken();
	//      let connection = await openWebSocket(`${WS_URL}/?token=${WS_TOKEN}`)
	// if (connection) {
       //        (async () => {
       //               let trade = await tradeFlow(numOfOtc);
	// 		let settlement = await settlementFlow(numOfOtc)
	// 	})();
	// }
	let stuff = await companyFlow(REST_TOKEN, `085ddec5-1581-11ee-aa59-9c7bef42b27b`);
	console.log(JSON.stringify(stuff));
})();
