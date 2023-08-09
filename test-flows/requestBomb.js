require('dotenv').config();
const logger = require('../services/winston');
const { sendWebSocketMessage, setMessageHandler} = require('../services/websocket');
const COMPANY_ID = process.env.ENV === 'DEV' ? process.env.DEV_COMPANY_ID  : process.env.UAT_COMPANY_ID;


async function requestBomb (numOfUsers) {
    for (i = 0 ; i < numOfUsers ; i++) {
        logger.info(`Sending ten requests, round ${i}`);
        sendWebSocketMessage(JSON.stringify({
            type: 'get_unsettled_trades',
            id: 'dc01e864-f3ed-4d4a-8110-0193f750a917',
            data: {
                company_id: `${COMPANY_ID}`,
            },
        }));
        
        sendWebSocketMessage(JSON.stringify({
                type: 'get_transaction_accounts',
                id: `fromAccount`,
                data: {
                    order_by: 'created_at',
                    sort: 'DESC',
                    currencies: [],
                    owner: `COMPANY`,
                    companies: [`${COMPANY_ID}`],
                },
            }));
           
            sendWebSocketMessage(JSON.stringify({
                id: '88d594c9-5bd6-489e-9ee9-d70c6c0fb73b',
                type: 'balance',
                data: {
                    show_empty: true,
                    order_by: 'amount',
                    sort: 'DESC',
                    date: '',
                    company: `${COMPANY_ID}`,
                },
            }));
        
            sendWebSocketMessage(JSON.stringify(
                {
                    "type": "time",
                    "id": "746dbb29-faf0-4c30-a8d1-c62843b875b7",
                    "data": {}
                }
            ))
        
            sendWebSocketMessage(JSON.stringify(
                {
                    "type": "get_counter_data",
                    "id": "e5929ec4-17c2-4bf9-b4a6-538c8f22e407",
                    "data": {}
                }
            ))
        
            sendWebSocketMessage(JSON.stringify(
                {
                    "id": 1,
                    "type": "get_frame",
                    "group": "dashboard",
                    "data": {}
                }
            ))
        
            sendWebSocketMessage(JSON.stringify(
                {
                    "type": "get_product_config",
                    "id": "global",
                    "data": {}
                }
            ))
        
            sendWebSocketMessage(JSON.stringify(
                {
                    "type": "settlement_blotter",
                    "id": "90b99d33-0088-11ee-bf28-162b04727a91",
                    "data": {
                        "limit": 55,
                        "offset": 0,
                        "sort": "DESC",
                        "filter_col": [
                            "status",
                            "id",
                            "creation_date",
                            "currencies",
                            "counterparty",
                            "sum_legs"
                        ],
                        "id": "",
                        "csv": false,
                        "page_direction": "NEXT"
                    }
                }
            ))
        
            sendWebSocketMessage(JSON.stringify(
                {
                    "id": "dc366e7b-439d-440b-8053-086412416a6c",
                    "type": "get_publication",
                    "data": {
                        "limit": 6,
                        "order_by": "updated_at",
                        "sort": "ASC",
                        "offset": 0
                    }
                }
            ))
        
            sendWebSocketMessage(JSON.stringify(
                {
                    "id": "e70ffea7-3190-43fc-9900-eddcb8f6cdb6",
                    "type": "get_prefunding",
                    "data": {
                        "show_empty": true,
                        "date": ""
                    }
                }
            ))
    }

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
            logger.info(`The response time after sending ${i * 10} requests is ${(responseTime/1000).toFixed(2)} seconds.`);
    }
    

module.exports = {
	requestBomb
};
