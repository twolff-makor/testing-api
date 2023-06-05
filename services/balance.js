require('dotenv').config();
const {sendWebSocketMessage, setMessageHandler } = require('./websocket');
const winston = require('winston');

let gotBalance = false; 

const dataToSend = JSON.stringify({
 "id": "88d594c9-5bd6-489e-9ee9-d70c6c0fb73b",
 "type": "balance",
 "data": {
    "show_empty": true,
    "order_by": "amount",
    "sort": "DESC",
    "date": "",
    "company": "62b08b48-aaa7-11ed-a122-0a45617894ef"
    }
});

  async function handleBalance(data) {
      return new Promise((resolve, reject) => {  
          const balance = data.content.balance
          console.log(balance);
          resolve(balance);
          gotBalance = true;   
        });
      }
        
  async function getCompanyBalance() {
    if (gotBalance == false) {
      sendWebSocketMessage(dataToSend);
      console.log(dataToSend)
      setMessageHandler(handleBalance);
      }  
  }
  
module.exports = {
    getCompanyBalance
  };



