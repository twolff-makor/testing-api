// websocket.js

const WebSocket = require('ws');

let ws;

function openWebSocket(url) {
  return new Promise((resolve, reject) => {
    if (!ws) {
      ws = new WebSocket(url);
  
      ws.on('open', () => {
        console.log('WebSocket connection established.');
        resolve(ws)
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

function setMessageHandler(onMessage) {
  if (ws) {
    ws.on('message', (data) => {
        data = JSON.parse(data.toString('utf8'));
        // console.log('Received message:', data);
        onMessage(data);
    });
  }
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
  sendWebSocketMessage
};
