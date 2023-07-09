require('dotenv').config();
const winston = require('winston');
const { getWsToken, getRestToken } = require('./services/auth');
const { openWebSocket } = require('./services/websocket');
const { settlementFlow } = require('./controllers/settlementFlow');
const { tradeFlow, pause } = require('./controllers/tradeFlow');
const { companyFlow } = require('./controllers/companyFlow');

const WS_URL = process.env.ENV === 'DEV' ? process.env.DEV_WS_URL : process.env.UAT_WS_URL;

// enter a number between 1 and 50 (can handle more but will take a while to run, may have lack of precision : to fix)
let numOfOtc = 10;

(async () => {
	const REST_TOKEN = await getRestToken();
	let WS_TOKEN = await getWsToken();
	let connection = await openWebSocket(`${WS_URL}/?token=${WS_TOKEN}`);

	if (process.env.ENV === 'DEV') {
		let company = await companyFlow(REST_TOKEN);
	} else if (process.env.ENV === 'UAT') {
		if (connection) {
			(async () => {
				let trade = await tradeFlow(numOfOtc);
				let settlement = await settlementFlow(numOfOtc);
			})();
		}
	}
})();
