import React, { useEffect, useState, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import ChatUI from "./components/ChatUI";

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
        stompClient.current.subscribe('/topic/messages', (messageOutput) => {
            setMessages((prevMessages) => [...prevMessages, JSON.parse(messageOutput.body)]);
        });
    };

    stompClient.current.activate();

    return () => {
      stompClient.current.deactivate();
    };
  }, [serverUrl]);

    const sendMessage = async () => {
        // IP 주소 수집
        const response = await fetch("https://api64.ipify.org?format=json");
        const data = await response.json();
        const ipAddress = data.ip;

        // 메시지 전송
        stompClient.current.publish({
            destination: "/app/chat",
            body: JSON.stringify({
                content: inputMessage,
                timestamp: new Date().toLocaleTimeString(),
                ipAddress: ipAddress  // IP 주소 추가
            })
        });

        setInputMessage('');
    };

  return (
      <ChatUI
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          sendMessage={sendMessage}
          messages={messages}
      />
  );
}
