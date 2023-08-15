require('dotenv').config();
const winston = require('winston');
const { getToken} = require('./services/auth');
const { openWebSocket } = require('./services/websocket');
const { settlementFlow } = require('./test-flows/settlementFlow');
const { tradeFlow, pause } = require('./test-flows/tradeFlow');
const { companyFlow } = require('./test-flows/companyFlow');
const { openThem } = require('./test-flows/parallelConnection');
const { requestBomb } = require('./test-flows/requestBomb');
const { requestSpeed } = require('./test-flows/requestSpeed');
const WS_URL = process.env.ENV === 'DEV' ? process.env.DEV_WS_URL : process.env.UAT_WS_URL;

// enter a number between 1 and 50 (can handle more but will take a while to run, may have lack of precision : to fix)
let numOfOtc = 1;
const numOfUsers = 20;

(async () => {
	const TOKEN = await getToken();
	const connection = await openWebSocket(`${WS_URL}/?token=${TOKEN}`);
	
if(connection) {
	requestSpeed();
}		
	// if (process.env.ENV === 'DEV') {
	// 	let company = await companyFlow(TOKEN);
	// 	// if (connection) {
	// 	// 	(async () => {
	// 	// 		await tradeFlow(numOfOtc);
	// 	// 		await settlementFlow(numOfOtc);
	// 	// 	})();
	// 	// }
	// } else if (process.env.ENV === 'UAT') {
	// 	if (connection) {
	// 		(async () => {
	// 			await tradeFlow(numOfOtc);
	// 			await settlementFlow(numOfOtc);
	// 		})();
	// 	}
	// }	

})();