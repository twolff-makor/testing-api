require('dotenv').config();
const logger = require('../services/winston');
const { sendWebSocketMessage, setMessageHandler} = require('../services/websocket');

async function requestSpeed () {
        logger.info(`Sending get transaction account request`);
        const startTime = performance.now();
        sendWebSocketMessage(JSON.stringify({
            type: 'get_transaction_accounts',
            id: 'toAccounts',
            data: {
                order_by: 'created_at',
                sort: 'DESC',
                owner: 'ENIGMA',
                currencies: [],
            },
        }));
       const responseTime = await setMessageHandler(() => {
        const endTime = performance.now();
        return (endTime - startTime);}, `get_transaction_accounts`);
        logger.info(`The response time is ${(responseTime/1000)} seconds.`);
    }


module.exports = {
	requestSpeed
};
