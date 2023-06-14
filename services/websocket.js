const WebSocket = require('ws');

let ws;

function openWebSocket(url) {
	return new Promise((resolve, reject) => {
		if (!ws) {
			ws = new WebSocket(url);

			ws.on('open', () => {
				console.log('WebSocket connection established.');
				resolve(ws);
			});

			ws.on('close', () => {
				console.log('WebSocket connection closed.');
				ws = null;
			});

			ws.on('error', (error) => {
				console.error('WebSocket error:', error);
			});
		}
	});
}

async function setMessageHandler(onMessage, requestType) {
	return new Promise(async (resolve, reject) => {
		const messageListener = (data) => {
			data = JSON.parse(data.toString('utf8'));
			responseType = data.type;
			if (data.type == requestType) {
				let messageHandled = onMessage(data);
				if (messageHandled) {ws.removeListener('message', messageListener);}
				resolve(messageHandled);
			} else {
				// console.log(`this is type sent: ${requestType} and this is type received: ${data.type}`);
			}
		};
		if (ws) {
			ws.on('message', messageListener);
		}
	});
}

function closeWebSocket() {
	if (ws) {
		ws.close();
	}
}

function sendWebSocketMessage(message) {
	if (ws && ws.readyState === WebSocket.OPEN) {
		ws.send(message);
	}
}

module.exports = {
	openWebSocket,
	setMessageHandler,
	closeWebSocket,
	sendWebSocketMessage,
};
