import React, { useEffect, useState, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const stompClient = useRef(null);

  const serverUrl = process.env.SERVER_URL + '/websocket';

  useEffect(() => {
    const socket = new SockJS(serverUrl);
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
    });

    stompClient.current.onConnect = (frame) => {
      console.log('Connected: ' + frame);
      stompClient.current.subscribe('/topic/messages', (messageOutput) => {
        setMessages((prevMessages) => [...prevMessages, JSON.parse(messageOutput.body).content]);
      });
    };

    stompClient.current.activate();

    return () => {
      stompClient.current.deactivate();
    };
  }, [serverUrl]);

  const sendMessage = () => {
    stompClient.current.publish({
      destination: "/app/chat",
      body: JSON.stringify({
        content: inputMessage
      })
    });
    setInputMessage('');
  };

  return (
      <div>
        <h1>MY REACT APP💗</h1>
        <div style={{ marginBottom: '20px' }}>
          <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type a message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
        <div>
          {messages.map((message, index) => (
              <p key={index}>{message}</p>
          ))}
        </div>
      </div>
  );
}
