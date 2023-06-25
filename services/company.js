require('dotenv').config();
const axios = require('axios');
const winston = require('winston');

async function getUtils(REST_TOKEN) {
	return new Promise((resolve, reject) => {
		axios
			.get(`${process.env.REST_URL}/utils`, {
				headers: {
					'Authorization': `Bearer ${REST_TOKEN}`,
					},
			})
			.then((response) => {
				const countries = response.data.country.map((item) => item.country_code);
				resolve(countries);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

async function getProducts(REST_TOKEN) {
	return new Promise((resolve, reject) => {
		axios
			.get(`${process.env.REST_URL}/product`, {
				headers: {
					'Authorization': `Bearer ${REST_TOKEN}`,
					},
			})
			.then((response) => {
				const res = response.data.products.map(function(obj) {
					return {
					  	id: obj.id,
						fiat: obj.fiat,
						default_qty: obj.config.default_qty,
						authorized_qty_max: obj.config.authorized_qty.max,
						authorized_qty_min: obj.config.authorized_qty.min
					};
				  });
				  let products = generateRandomProducts(res);
				resolve(products);
			})
			.catch((error) => {
				reject(error);
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
	var oneYearFromNow = new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), currentDate.getDate());
	var formattedDate = oneYearFromNow.toISOString().slice(0, 19) + ".000Z";
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

  function generateRandomProducts(products) {
	let randomLength = Math.floor(Math.random() * (products.length/4));
	let randomIndexes = [];
	
	while (randomIndexes.length < randomLength) {
	 let randomIndex = Math.floor(Math.random() * products.length);
	  
	  if (!randomIndexes.includes(randomIndex)) {
		randomIndexes.push(randomIndex);
	  }
	}
	
	let randomProducts = randomIndexes.map(function(index) {
	  return products[index];
	});
	
	return randomProducts;
  }

async function generateCompanyDetails(REST_TOKEN) {
	return new Promise(async (resolve, reject) => {
		const countries = await getUtils(REST_TOKEN);
		const randomCountry = countries[Math.floor(Math.random() * countries.length)];
		const legalName = generateRandomString();
		const nickName = legalName;
		const subDomain = legalName.replace(/ /g, '_');
		const expiresAt = generateExpirationDate();
		const apisAndModules = generateTrueFalse();
		const products = await getProducts(REST_TOKEN);
		resolve([randomCountry, legalName, nickName, subDomain, expiresAt, apisAndModules,products])
	});
}


async function generateCompanyDetails(REST_TOKEN) {
	return new Promise(async (resolve, reject) => {
		const countries = await getUtils(REST_TOKEN);
		const randomCountry = countries[Math.floor(Math.random() * countries.length)];
		const legalName = generateRandomString();
		const nickName = legalName;
		const subDomain = legalName.replace(/ /g, '_');
		const expiresAt = generateExpirationDate();
		const apisAndModules = generateTrueFalse();
		const products = await getProducts(REST_TOKEN);
		resolve([randomCountry, legalName, nickName, subDomain, expiresAt, apisAndModules,products])
	});
}


async function createCompany(token) {
	const response = await axios
		.post(`${process.env.DEV_URL}/company`, {                  ///NOTICE THIS IS DEV NOT UAT !!!!!!
			"companyDetails": {
				"country": `${randomCountry}`,
				"legalName": `${legalName}`,  // generate --> testing + randomNum
				"nickName": `${nickName}`, // generate --> testing + randomNum
				"subDomain": `${subDomain}`, // generate --> testing + randomNum
				"external_url": null, // leave as is
				"expires_at": `${expiresAt}` // generate year from today -1
			},
			"APIs": {
				"WS": `${apisAndModules[0]}`, // randomize true / false
				"REST": `${apisAndModules[1]}`, // randomize true / false
				"FIX": `${apisAndModules[2]}` // randomize true / false
			},
			"modules": {
				"trading": `${apisAndModules[3]}`, // randomize true / false
				"settlement": `${apisAndModules[4]}`, // randomize true / false
				"market data": `${apisAndModules[5]}`, // randomize true / false
				"analytics": `${apisAndModules[6]}` // randomize true / false
			},
			"products":   // getProducts --> run over params
				`${products}`
			,
			"exposures": [ // getCurrencies --> run over exposures for is, put in random amount between 10000-1000000
				{
					"id": "aaae2904-46e8-11ed-b0b7-9c7bef452f5f",
					"amount": 10000
				}
			],
			"productsFee": [],
			"fee_rate": 2, // generate random number
			"status": "ACTIVE", // leave as is
			"pnl": [] // getUsers --> run over get users response
		})
		.catch((error) => {
			logger.error(error);
		});

	const balance = JSON.stringify(response.data);
	return balance;
}

module.exports = {
	generateCompanyDetails
};
