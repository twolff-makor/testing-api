require('dotenv').config();
const { sendWebSocketMessage, setMessageHandler } = require('./websocket');
// const { createdTrade } = require('../controllers/tradeFlows')
const winston = require('winston');
const WS_URL = process.env.WS_URL;

const counterparties = ['04ea951e-3457-11ed-9f51-9c7bef452f5f'];
const products = [
	{
		name: 'BTC-USD',
		lowPrice: 26000,
		highPrice: 29000,
		lowQty: 0.0001,
		highQty: 20,
		decimals: 2,
	},
	{
		name: 'USDC-USD',
		lowPrice: 26000,
		highPrice: 29000,
		lowQty: 1,
		highQty: 1000,
		decimals: 2,
	},
	{
		name: 'BTC-USDC',
		lowPrice: 26000,
		highPrice: 29000,
		lowQty: 0.0001,
		highQty: 10,
		decimals: 2,
	},
	{
		name: 'BTC-EUR',
		lowPrice: 26000,
		highPrice: 29000,
		lowQty: 0.0001,
		highQty: 10,
		decimals: 2,
	},
	{
		name: 'ETH-USD',
		lowPrice: 26000,
		highPrice: 29000,
		lowQty: 0.001,
		highQty: 100,
		decimals: 2,
	},
	{
		name: 'BTC-GBP',
		lowPrice: 26000,
		highPrice: 29000,
		lowQty: 0.0001,
		highQty: 10,
		decimals: 2,
	},
	{
		name: 'USDC-EUR',
		lowPrice: 26000,
		highPrice: 29000,
		lowQty: 1,
		highQty: 1000,
		decimals: 2,
	},
	{
		name: 'ADA-USD',
		lowPrice: 26000,
		highPrice: 29000,
		lowQty: 1,
		highQty: 2000,
		decimals: 2,
	},
	{
		name: 'BUSD-USD',
		lowPrice: 26000,
		highPrice: 29000,
		lowQty: 1,
		highQty: 1000,
		decimals: 2,
	},
	{
		name: 'ETH-EUR',
		lowPrice: 26000,
		highPrice: 29000,
		lowQty: 0.001,
		highQty: 100,
		decimals: 2,
	},
	{
		name: 'TRX-USD',
		lowPrice: 26000,
		highPrice: 29000,
		lowQty: 2,
		highQty: 4000,
		decimals: 2,
	},
	{
		name: 'XLM-USD',
		lowPrice: 26000,
		highPrice: 29000,
		lowQty: 2,
		highQty: 4000,
		decimals: 2,
	},
];
const sides = ['BUY', 'SELL'];
const companies = ['62b08b48-aaa7-11ed-a122-0a45617894ef'];

function handleTradeMessage(message) {
	if ((message.code = 200 && message.content)) {
		const tradeId = message.id;
		return `NEW TRADE CREATED, TRADE GROUP ID ${tradeId}`;
	} else {
	}
}

function getRandomItem(array) {
	let item = array[Math.floor(Math.random() * array.length)];
	return item;
}

function getRandomNumber(min, max, decimals) {
	const randomNumber = Math.random() * (max - min) + min;
	const roundedNumber = randomNumber.toFixed(decimals);
	return roundedNumber; // parseFloat?
}

function getIsoDate() {
	const now = new Date();
	const formattedDateTime = now.toISOString();
	return formattedDateTime;
}

function generateOtcParams() {
	let generateSide = getRandomItem(sides);
	let generateCounterparty = getRandomItem(counterparties);
	let generateCompany = getRandomItem(companies);
	let productsIndex = products[Math.floor(Math.random() * products.length)];
	let generateQty = getRandomNumber(
		productsIndex.lowQty,
		productsIndex.highQty,
		productsIndex.decimals
	);
	let generateProduct = productsIndex.name;
	let generateProviderPrice = getRandomNumber(
		productsIndex.lowPrice,
		productsIndex.highPrice,
		productsIndex.decimals
	);
	let generateCompanyPrice =
		generateSide === 'BUY'
			? generateProviderPrice * (1 + 5 / 10000)
			: generateProviderPrice * (1 - 5 / 10000);
	let generateDate = getIsoDate();
	// let params = [counterparty, product, side, qty, providerPrice, date, company, companyPrice]
	let params = {
		counterparty: generateCounterparty,
		product: generateProduct,
		side: generateSide,
		qty: generateQty,
		providerPrice: generateProviderPrice,
		date: generateDate,
		company: generateCompany,
		companyPrice: generateCompanyPrice,
	};

	return params;
}

async function createOtcTrade(
	counterparty,
	product,
	side,
	qty,
	providerPrice,
	date,
	company,
	companyPrice,
	createdAllTrades
) {
	return new Promise((resolve, reject) => {
	const dataToSend = JSON.stringify({
		group: 'otc',
		type: 'report_trade_otc',
		data: {
			providers_trades: [
				{
					counterparty: `${counterparty}`,
					user: '3331a59b-a2c4-11ed-a122-0a45617894ef',
					product: `${product}`,
					side: `${side}`,
					status: 'VALIDATED',
					quantity: `${qty}`,
					type: 'MANUAL FILL',
					price: `${providerPrice}`,
					comment: '',
					executed_at: `${date}`,
				},
			],
			trade_company: {
				counterparty: `${company}`,
				product: `${product}`,
				side: `${side}`,
				status: 'VALIDATED',
				quantity: `${qty}`,
				type: 'MANUAL FILL',
				price: `${companyPrice}`,
				comment: '',
				executed_at: `${date}`,
			},
			otc_type: 'PAIRED',
		},
	});
		sendWebSocketMessage(dataToSend);
		response = setMessageHandler(handleTradeMessage, `report_trade_otc`);
		resolve(response);
	});
}

module.exports = {
	createOtcTrade,
	generateOtcParams,
};
