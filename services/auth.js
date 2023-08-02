require('dotenv').config();
const axios = require('axios');
const logger = require('../services/winston');
const REST_URL = process.env.ENV === 'DEV' ? process.env.DEV_REST_URL  : process.env.UAT_REST_URL;
const USERNAME = process.env.ENV === 'DEV' ? process.env.DEV_USERNAME : process.env.UAT_USERNAME;
const PASSWORD = process.env.ENV === 'DEV' ? process.env.DEV_PASSWORD : process.env.UAT_PASSWORD;

async function getToken() {
	return new Promise((resolve, reject) => {
		let request = axios.put(`${REST_URL}/auth`, {
			username: USERNAME,
			password: PASSWORD,
		  }, {
			headers: {
			  'Origin': 'http://localhost:3000',
			},
		  })
			.then((response) => {
				let REST_TOKEN = JSON.stringify(response.data.token);
				REST_TOKEN = REST_TOKEN.slice(1, -1);
				resolve(REST_TOKEN);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

module.exports = { getToken,};
