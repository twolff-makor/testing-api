require('dotenv').config();
const winston = require('winston');
const { sendWebSocketMessage, setMessageHandler } = require('./websocket');
const BigNumber = require('bignumber.js');
const COMPANY_ID = process.env.ENV === 'DEV' ? process.env.DEV_COMPANY_ID  : process.env.UAT_COMPANY_ID 

function getFormattedDate() {
	const today = new Date();
	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, '0');
	const day = String(today.getDate()).padStart(2, '0');
	const formattedDate = `${year}-${month}-${day}`;
	return formattedDate;
}

const currentDate = getFormattedDate();

async function getTradeSum(data) {
	const unsettledTrades = data.content.unsettled_trades;
	return new Promise((resolve, reject) => {
		let baseSum = 0;
		let quoteSum = 0;
		for (const trade of unsettledTrades) {
			const [base, quote] = trade.product?.split('-');
			baseAmount = +new BigNumber(trade.legs[base].amount).integerValue();
			quoteAmount = +new BigNumber(trade.legs[quote].amount).integerValue();
			baseSum += baseAmount;
			quoteSum += quoteAmount;
		}
		const tradeSums = { base: baseSum, quote: quoteSum };
		resolve(tradeSums);
	});
}

async function handleNumOfTrades(data) {
	return new Promise((resolve, reject) => {
		const trades = data.content?.unsettled_trades || [];
		let tradesNum = 0;
		for (const trade of trades) {
			tradesNum += trade.trades;
		}
		resolve(tradesNum);
	});
}

async function handleUnsettledTrades(data) {
	return new Promise((resolve, reject) => {
		const trades = data.content?.unsettled_trades || [];
		const tradeCollections = trades.map((item) => item.trade_collection);
		resolve(tradeCollections);
	});
}

async function getUnsettledTrades() {
	return new Promise((resolve, reject) => {
		const dataToSend = JSON.stringify({
			type: 'get_unsettled_trades',
			id: 'dc01e864-f3ed-4d4a-8110-0193f750a917',
			data: {
				company_id: `${COMPANY_ID}`,
			},
		});
		sendWebSocketMessage(dataToSend);
		setMessageHandler(resolve, `get_unsettled_trades`);
	});
}

async function createSettlement(collectedTrades) {
	return new Promise((resolve, reject) => {
		const dataToSend = JSON.stringify({
			type: 'create_settlement',
			data: {
				trades_collection: collectedTrades,
				company_id: `${COMPANY_ID}`,
			},
		});
		sendWebSocketMessage(dataToSend);
		const response = setMessageHandler(handleSettlementMessage, `create_settlement`);
		resolve(response);
	});
}

function handleSettlementMessage(message) {
	if ((message.code = 200 && message.content)) {
		const settlementId = message.content.settlement_id;
		return `NEW SETTLEMENT CREATED, SETTLEMENT ID ${settlementId}`;
	} else {
	}
}

// }===============================================================================================================================
async function getFirstSettlementId() {
	return new Promise(async (resolve, reject) => {
		const dataToSend = JSON.stringify({
			type: 'settlement_blotter',
			id: '9ef7748b-0061-11ee-bf28-162b04727a91',
			data: {
				limit: 55,
				offset: 0,
				sort: 'DESC',
				filter_col: ['status', 'id', 'creation_date', 'currencies', 'counterparty', 'sum_legs'],
				companies: ['62b08b48-aaa7-11ed-a122-0a45617894ef'],
				providers: [],
				id: '',
				csv: false,
				page_direction: 'NEXT',
			},
		});
		sendWebSocketMessage(dataToSend);
		const response = await setMessageHandler((data) => {
			const id = data.content.data[0].id;
			return id;
		}, `settlement_blotter`);
		resolve(response);
	});
}
// }===============================================================================================================================

async function getSettlementLegs() {
	const settlementId = await getFirstSettlementId();
	return new Promise(async (resolve, reject) => {
		const dataToSend = JSON.stringify({
			type: 'get_settlement',
			data: {
				id: `${settlementId}`,
			},
		});
		sendWebSocketMessage(dataToSend);
		const response = setMessageHandler(handleSettlementLegs, `get_settlement`);
		resolve(response);
	});
}

async function handleSettlementLegs(data) {
	return new Promise(async (resolve, reject) => {
		data = data.content.legs;
		legDetails = data.map((leg) => ({
			id: leg.id,
			amount: leg.amount,
			code: leg.code,
		}));
		legDetails.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
		resolve(legDetails);
	});
}

async function getEnigmaTransactionAccount() {
	return new Promise(async (resolve, reject) => {
		let response;
		const dataToSend = JSON.stringify({
			type: 'get_transaction_accounts',
			id: 'toAccounts',
			data: {
				order_by: 'created_at',
				sort: 'DESC',
				owner: 'ENIGMA',
				currencies: [],
			},
		});
		sendWebSocketMessage(dataToSend);
		response = await setMessageHandler(handleTransactionAccount, `get_transaction_accounts`);
		resolve(response);
	});
}

async function getCompanyTransactionAccount() {
	return new Promise(async (resolve, reject) => {
		let response;
		const dataToSend = JSON.stringify({
			type: 'get_transaction_accounts',
			id: `fromAccount`,
			data: {
				order_by: 'created_at',
				sort: 'DESC',
				currencies: [],
				owner: `COMPANY`,
				companies: [`${COMPANY_ID}`],
			},
		});
		sendWebSocketMessage(dataToSend);
		response = await setMessageHandler(handleTransactionAccount, `get_transaction_accounts`);
		resolve(response);
	});
}

async function handleTransactionAccount(data) {
	return new Promise((resolve, reject) => {
		data = data.content.transaction_accounts;
		const accountByCurrency = {};
		for (const item of data) {
			const key = item.code;
			const value = item.id;
			if (accountByCurrency[key]) {
				accountByCurrency[key].push(value);
			} else {
				accountByCurrency[key] = [value];
			}
		}
		resolve(accountByCurrency);
	});
}

async function addSettlementTransaction(legId, legAmount, fromAccount, toAccount) {
	let date = getFormattedDate();
	return new Promise(async (resolve, reject) => {
		let response;
		const dataToSend = JSON.stringify({
			type: 'add_transactions',
			data: {
				settlement_leg: `${legId}`,
				transactions: [
					{
						amount: `${legAmount}`,
						transaction_at: `${date}`,
						from_account: `${fromAccount}`,
						to_account: `${toAccount}`,
					},
				],
				company_id: `${COMPANY_ID}`,
			},
		});
		sendWebSocketMessage(dataToSend);
		response = await setMessageHandler((data) => {
			const res = data.message;
			return res;
		}, `add_transactions`);
		resolve(response);
	});
}

let transactionStatus;

async function getTransactionId(status) {
	const settlementId = await getFirstSettlementId();
	transactionStatus = status;
	return new Promise(async (resolve, reject) => {
		const dataToSend = JSON.stringify({
			type: 'get_settlement',
			data: {
				id: `${settlementId}`,
			},
		});
		sendWebSocketMessage(dataToSend);
		const response = await setMessageHandler(handleTransactionId, `get_settlement`);
		resolve(response);
	});
}

function handleTransactionId(data) {
	data = data.content.legs.filter((item) => item.status == transactionStatus);
	const transactionId = data[0].transaction[0].id;
	return transactionId;
}

async function validateTransaction(transactionId) {
	return new Promise(async (resolve, reject) => {
		let response;
		const dataToSend = JSON.stringify({
			type: 'update_transactions',
			data: {
				transaction: `${transactionId}`,
				status: 'VALIDATED',
				external_reference: 'Automated Validation',
				company_id: `${COMPANY_ID}`,
			},
		});
		sendWebSocketMessage(dataToSend);
		response = await setMessageHandler((data) => {
			const res = data.message;
			return res;
		}, `update_transactions`);
		resolve(response);
	});
}

module.exports = {
	createSettlement,
	handleUnsettledTrades,
	handleNumOfTrades,
	getUnsettledTrades,
	getTradeSum,
	getCompanyTransactionAccount,
	getEnigmaTransactionAccount,
	getSettlementLegs,
	addSettlementTransaction,
	getTransactionId,
	validateTransaction,
};

// async function getCompanyTransactionAccount() {          ====================================================== maybe refactor later
// 	return new Promise(async (resolve, reject) => {
// 		const sideToSend = [`COMPANY`, `ENIGMA`];
// 		const responseObj = {};
// 		let response;
// 		for (const side of sideToSend) {
// 			let moreData = side == `COMPANY` ?  ['62b08b48-aaa7-11ed-a122-0a45617894ef'] : '' ;
// 			const dataToSend = JSON.stringify({
// 				type: 'get_transaction_accounts',
// 				id: `fromAccount`,
// 				data: {
// 					order_by: 'created_at',
// 					sort: 'DESC',
// 					currencies: [],
// 					owner: `${side}`,
// 					companies : [`${moreData}`]
// 				},
// 			});
// 			console.log(dataToSend);
// 			sendWebSocketMessage(dataToSend);
// 			response = await setMessageHandler(console.log);
// 			// responseObj[side] = response;
// 		}
// 		console.log(JSON.stringify(response));
// 		resolve(responseObj);
// 	});
// }

// async function validateTransaction(transaction) {
// 	let date = getFormattedDate();
// 	return new Promise(async (resolve, reject) => {
// 		let response;
// 		const dataToSend = JSON.stringify({
// 			"type": "update_transactions",
// 			"data": {
// 				"transaction": "9a7cf3d8-0aa9-11ee-bf28-162b04727a91",
// 				"status": "VALIDATED",
// 				"external_reference": "Automated Validation",
// 				"company_id": `${process.env.UAT_COMPANY_ID}`
// 			}
// 		});
// 		sendWebSocketMessage(dataToSend);
// 		console.log(dataToSend);
// 		response = await setMessageHandler(handleTransactionAccount, `update_transactions`);
// 		console.log(response);
// 		resolve (response)
// 	});
// }
