const WebSocket = require('ws');
const WS_URL = process.env.ENV === 'DEV' ? process.env.DEV_WS_URL : process.env.UAT_WS_URL;

const numConnections = 800;
const connections = [];
	
	function openThem(TOKEN) {
        for (let i = 0; i < numConnections; i++) {
            openConnection(i, TOKEN);
		}
	}



    function openConnection(index, TOKEN) {
		const ws = new WebSocket(`${WS_URL}/?token=${TOKEN}`);

		ws.onopen = () => {
			console.log(`Connection ${index} opened`);
			ws.send(
				JSON.stringify({
					type: 'time',
					id: 'e44b4b5e-e2dc-4054-9955-30097dc2b6a7',
					data: {},
				})
			);
			console.log(`sent message ${index}`);
			ws.send(
				JSON.stringify({
					id: 1,
					type: 'get_frame',
					group: 'dashboard',
					data: {},
				})
			);
		};

		ws.onmessage = (event) => {
			console.log(`Connection ${index} received message: ${event.data}`);
		};

		ws.onclose = () => {
			console.log(`Connection ${index} closed`);
			openConnection(index);
		};

		ws.onerror = (error) => {
			console.error(`Connection ${index} error: ${JSON.stringify(error)}`);
		};

		connections[index] = ws;
	}
    
    module.exports = {
        openThem,
    };
