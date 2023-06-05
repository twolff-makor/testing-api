require('dotenv').config();
const axios = require('axios');
const winston = require('winston');
const URL = process.env.URL|| `http://uat.rest-api.enigma-x.io`;


async function getBalance(token) {
    const response = await axios.get(`${URL}/balance`, 
                {headers: {'Authorization': `Bearer ${token}`}})
                .catch(error => {
                    console.error(error);
                });
    
    const balance = JSON.stringify(response.data);
    return balance;
}



module.exports = {
    getBalance
  };