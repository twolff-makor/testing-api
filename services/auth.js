require('dotenv').config();
const axios = require('axios');
const URL = process.env.REST_URL;
const USERNAME = process.env.UAT_USERNAME;
const PASSWORD = process.env.UAT_PASSWORD;

// async function getToken() {
//     const response = await axios.put(`https://uat.rest-api.enigma-x.io/auth`, {
//                                     "username": USERNAME,
//                                     "password": PASSWORD
//                             })
//                             .catch(error => {
//                                 console.error(error);
//                             });
//     const token = JSON.stringify(response.data.token);
//     return token;
// }

// module.exports = { getToken };


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
  