require('dotenv').config();
const { sendWebSocketMessage, setMessageHandler } = require('./websocket');
const logger = require('../services/winston');
const COMPANY_ID = process.env.ENV === 'DEV' ? process.env.DEV_COMPANY_ID  : process.env.UAT_COMPANY_ID; 


async function handleBalance(data) {
	return new Promise((resolve, reject) => {
		const balance = data.content.balance;
		resolve(balance);
	});
}

async function getCompanyBalance(show_empty) {
	const dataToSend = JSON.stringify({
		id: '88d594c9-5bd6-489e-9ee9-d70c6c0fb73b',
		type: 'balance',
		data: {
			show_empty: show_empty,
			order_by: 'amount',
			sort: 'DESC',
			date: '',
			company: `${COMPANY_ID}`,
		},
	});
	return new Promise((resolve, reject) => {
		sendWebSocketMessage(dataToSend);
		setMessageHandler(async (data) => {
			const balance = await handleBalance(data);
			resolve(balance);
		}, 'balance');
	});
}

module.exports = {
	getCompanyBalance,
};
