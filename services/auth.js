require('dotenv').config();
const axios = require('axios');
const winston = require('winston');
const URL = process.env.REST_URL;
const USERNAME = process.env.UAT_USERNAME;
const PASSWORD = process.env.UAT_PASSWORD;

function getToken() {
    return new Promise((resolve, reject) => {
      axios
        .put(`https://uat.rest-api.enigma-x.io/auth`, {
          username: USERNAME,
          password: PASSWORD
        })
        .then(response => {
          const token = JSON.stringify(response.data.token);
          resolve(token);
        })
        .catch(error => {
          console.error(error);
          reject(error);
        });
    });
  }
  
  module.exports = { getToken };
  