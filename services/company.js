require('dotenv').config();
const axios = require('axios');
const logger = require('../services/winston');
const REST_URL = process.env.ENV === 'DEV' ? process.env.DEV_REST_URL : process.env.UAT_REST_URL;

async function getUtils(TOKEN) {
	return new Promise((resolve, reject) => {
		axios
			.get(`${REST_URL}/utils`, {
				headers: {
					Authorization: `Bearer ${TOKEN}`,
				},
			})
			.then((response) => {
				const countries = response.data.country.map((item) => item.country_code);
				resolve(countries);
			})
			.catch((error) => {
				logger.error(`getUtils threw this error :  ${error}`);
			});
	});
}

async function getProductsAndFiat(TOKEN) {
	return new Promise((resolve, reject) => {
		axios
			.get(`${REST_URL}/product`, {
				headers: {
					Authorization: `Bearer ${TOKEN}`,
				},
			})
			.then((response) => {
				const res = response.data.products.map((obj) =>{
					return {
						fiat: obj.fiat,
						product: {
							id: obj.id,
							name: obj.name,
							default_qty: obj.config.default_qty,
							authorized_qty_max: obj.config.authorized_qty.max,
							authorized_qty_min: obj.config.authorized_qty.min,
						},
					};
				});
				let products = generateRandomProducts(res);
				resolve(products);
			})
			.catch((error) => {
				logger.error(`getProductsAndFiat threw this error :  ${error}`);
			});
	});
}

function generateRandomProducts(products) {
	let randomLength = Math.floor(Math.random() * (products.length / 4));
	let randomIndexes = [];

	while (randomIndexes.length < randomLength) {
		let randomIndex = Math.floor(Math.random() * products.length);
		if (!randomIndexes.includes(randomIndex)) {
			randomIndexes.push(randomIndex);
		}
	}
	let randomProducts = randomIndexes.map(function (index) {
		return products[index];
	});
	return randomProducts;
}

async function generateExposures(fiat, TOKEN, companyId) {
	const params = companyId ? `&company=${companyId}` : `&active=true`;
	return new Promise((resolve, reject) => {
		
		fiat = [...new Set(fiat.filter((value) => value !== null))];
		axios
			.get(`${REST_URL}/currency?type=FIAT${params}`, {
				headers: {
					Authorization: `Bearer ${TOKEN}`,
				},
			})
			.then((response) => {
				let exposures = response.data.currencies;
				exposures = exposures
					.filter((item) => fiat.includes(item.code))
					.map((item) => ({
						id: item.id,
						amount: Math.floor(Math.random() * 1000000) + 1000,
					}));
				resolve(exposures);
			})
			.catch((error) => {
				logger.error(`generateExposures threw this error :  ${error}`);
			});
	});
}

function generateRandomString() {
	const randomNumber = Math.floor(Math.random() * 1000);
	const randomString = `Automated Testing ${randomNumber}`;
	return randomString;
}

function generateExpirationDate() {
	var currentDate = new Date();
	var oneYearFromNow = new Date(
		currentDate.getFullYear() + 1,
		currentDate.getMonth(),
		currentDate.getDate()
	);
	var formattedDate = oneYearFromNow.toISOString().slice(0, 19) + '.000Z';
	return formattedDate;
}

function generateTrueFalse() {
	var booleanArray = [];
	for (var i = 0; i < 7; i++) {
		var randomBoolean = Math.random() < 0.5;
		booleanArray.push(randomBoolean);
	}
	return booleanArray;
}

function generateRandomFees() {
	const randomNumber = Math.floor(Math.random() * 10) + 1;
	return randomNumber;
}

async function regenerateCompanyDetails(TOKEN, companyData, companyId) {
	return new Promise(async (resolve, reject) => {
		const randomCountry = companyData.companyDetails.country.country_code;
		const legalName = companyData.companyDetails.legalName;
		const nickName = legalName;
		const subDomain = companyData.companyDetails.subDomain;
		const expiresAt = companyData.companyDetails.expires_at;
		const apisAndModules = generateTrueFalse();
		const productsAndFiat = await getCompanyProducts(TOKEN, companyId);
		const products = productsAndFiat.map((item) => item.product);
		const fiat = productsAndFiat.map((item) => item.fiat);
		const exposures = await generateExposures(fiat, TOKEN, companyId);
		// const productsFee = false
		const feeRate = generateRandomFees();
		resolve([
			randomCountry,
			legalName,
			nickName,
			subDomain,
			expiresAt,
			apisAndModules,
			products,
			exposures,
			feeRate,
		]);
	});
}

async function getCompanyProducts(TOKEN, companyId) {
	return new Promise((resolve, reject) => {
		axios
			.get(`${REST_URL}/product?company=${companyId}`, {
				headers: {
					Authorization: `Bearer ${TOKEN}`,
				},
			})
			.then((response) => {
				const products = response.data.products.map((obj) =>{
					return {
						fiat: obj.fiat,
						product: {
							id: obj.id,
							name: obj.name,
							default_qty: obj.config.default_qty,
							authorized_qty_max: obj.config.authorized_qty.max,
							authorized_qty_min: obj.config.authorized_qty.min,
						},
					};
				});
				resolve(products);
			})
			.catch((error) => {
				logger.error(`getCompanyProducts threw this error :  ${error}`);
			});
	});
}

async function generateCompanyDetails(TOKEN) {
	return new Promise(async (resolve, reject) => {
		const countries = await getUtils(TOKEN);
		const randomCountry = countries[Math.floor(Math.random() * countries.length)];
		const legalName = generateRandomString();
		const nickName = legalName;
		const subDomain = legalName.replace(/ /g, '-').toLowerCase();
		const expiresAt = generateExpirationDate();
		const apisAndModules = generateTrueFalse();
		const productsAndFiat = await getProductsAndFiat(TOKEN);
		const products = productsAndFiat.map((item) => item.product);
		const fiat = productsAndFiat.map((item) => item.fiat);
		const exposures = await generateExposures(fiat, TOKEN);
		// const productsFee = false
		const feeRate = generateRandomFees();
		resolve([
			randomCountry,
			legalName,
			nickName,
			subDomain,
			expiresAt,
			apisAndModules,
			products,
			exposures,
			feeRate,
		]);
	});
}

async function createOrEditCompany(TOKEN, companyDetails, method, companyId) {
	const apisAndModules = companyDetails[5];
	const subDomain = method === "post" ? { subDomain: companyDetails[3],} : {};
	const response = await axios[method](
		`${REST_URL}/company/${companyId}`,
		{
			companyDetails: {
				country: `${companyDetails[0]}`,
				legalName: `${companyDetails[1]}`,
				nickName: `${companyDetails[2]}`,
				external_url: null,
				expires_at: `${companyDetails[4]}`,
				...subDomain
			},
			APIs: {
				WS: apisAndModules[0],
				REST: apisAndModules[1],
				FIX: apisAndModules[2],
			},
			modules: {
				trading: apisAndModules[3],
				settlement: apisAndModules[4],
				market_data: apisAndModules[5],
				analytics: apisAndModules[6],
			},
			products: companyDetails[6],
			exposures: companyDetails[7],
			productsFee: [],
			fee_rate: companyDetails[8],
			status: 'ACTIVE',
			pnl: [],
		},
		{
			headers: {
				Authorization: `Bearer ${TOKEN}`,
			},
		}
	).catch((error) => {
		logger.error(`createOrEditCompany threw this error :  ${error}`);
	});
	return response.data;
}

async function getCompany(TOKEN, company_id) {
	const response = await axios
		.get(`${REST_URL}/company/${company_id}`, {
			headers: {
				Authorization: `Bearer ${TOKEN}`,
			},
		})
		.catch((error) => {
			logger.error(`getCompany threw this error :  ${error}`);
		});
	return response.data;
}

module.exports = {
	createOrEditCompany,
	getCompany,
	generateCompanyDetails,
	regenerateCompanyDetails,
	getCompanyProducts,
};
