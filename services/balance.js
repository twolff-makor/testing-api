require('dotenv').config();
const { sendWebSocketMessage, setMessageHandler } = require('./websocket');
const winston = require('winston');

// let gotBalance = false;

const dataToSend = JSON.stringify({
	id: '88d594c9-5bd6-489e-9ee9-d70c6c0fb73b',
	type: 'balance',
	data: {
		show_empty: true,
		order_by: 'amount',
		sort: 'DESC',
		date: '',
		company: `${process.env.COMPANY_ID}`,
	},
});

async function handleBalance(data) {
	return new Promise((resolve, reject) => {
		const balance = data.content.balance;
		resolve(balance);
	});
}

async function getCompanyBalance() {
	return new Promise((resolve, reject) => {
		sendWebSocketMessage(dataToSend);
		setMessageHandler(async (data) => {
			const balance = await handleBalance(data);
			resolve(balance);
		}, `balance`);
	});
}

module.exports = {
	getCompanyBalance,
};
