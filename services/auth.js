require('dotenv').config();
const axios = require('axios');
const winston = require('winston');

async function getRestToken() {
	return new Promise((resolve, reject) => {
		axios
			.put(`${process.env.REST_URL}/auth`, {
				username: process.env.UAT_USERNAME,
				password: process.env.UAT_PASSWORD,
			})
			.then((response) => {
				const REST_TOKEN = JSON.stringify(response.data.token);
				resolve(REST_TOKEN);
			})
			.catch((error) => {
				logger.error(error);
				reject(error);
			});
	});
}

async function getWsToken() {
	return new Promise((resolve, reject) => {
		axios
			.put(`${process.env.REST_URL}/auth`, {
				username: process.env.UAT_USERNAME,
				password: process.env.UAT_PASSWORD,
			})
			.then((response) => {
				let WS_TOKEN = JSON.stringify(response.data.token);
				WS_TOKEN = WS_TOKEN.slice(1, -1);
				resolve(WS_TOKEN);
			})
			.catch((error) => {
				logger.error(error);
				reject(error);
			});
	});
}

module.exports = { getRestToken, getWsToken };
