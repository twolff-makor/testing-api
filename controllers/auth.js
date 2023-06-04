require('dotenv').config();
const axios = require('axios');
const URL = process.env.URL;
const USERNAME = process.env.UAT_USERNAME;
const PASSWORD = process.env.UAT_PASSWORD;

// let token 
// function getToken() {
//     return new Promise(async (resolve, reject) => {
//         if (!token) {
//             axios.put("https://uat.rest-api.enigma-x.io/auth", {
//                 "username": USERNAME,
        // "password": PASSWORD
//             })
//             .then(response => {
//                 token = JSON.stringify(response.data.token);
//                 console.log(`token inside of function should be defined ${token}`)
//                 // resolve(token);
//             })
//             .catch(error => {
//                 reject(error);
//                 console.error(error);
//             });
//             return resolve(token);
//         } else {
//             return token
//         }
        
//     })
// }


async function getToken() {
    const response = await axios.put("https://uat.rest-api.enigma-x.io/auth", {
                                    "username": "twolff",
                                    "password": "12345678!@Aa"
                            })
                            .catch(error => {
                                console.error(error);
                            });
    const token = JSON.stringify(response.data.token);
    return token;
}

module.exports = {getToken};