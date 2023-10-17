import React, { useEffect, useState, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import ChatUI from "./components/ChatUI";

export default function App() {
    const [ipAddress, setIpAddress] = useState('');
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [clients, setClients] = useState([]);  // 추가된 상태
    const stompClient = useRef(null);

    const serverUrl = process.env.SERVER_URL + '/ws';

    useEffect(() => {
        const fetchDataAndInitializeWebSocket = async () => {
            try {
                const response = await fetch("https://api64.ipify.org?format=json");
                const data = await response.json();
                const ipAddress = data.ip;
                setIpAddress(ipAddress);
            } catch (error) {
                console.error("Error fetching IP address:", error);
            }

            const socket = new SockJS(serverUrl);
            stompClient.current = new Client({
                webSocketFactory: () => socket,
                reconnectDelay: 5000,
            });

            stompClient.current.onConnect = (frame) => {
                console.log("[LOG] Socket 연결완료")
                // 메시지 구독 코드
                stompClient.current.subscribe('/topic/messages', (messageOutput) => {
                    console.log("[LOG] /topic/messages 서버로부터 메세지가 도착했습니다. messageOutput: ", JSON.parse(messageOutput.body))
                    setMessages((prevMessages) => [...prevMessages, JSON.parse(messageOutput.body)]);
                });

                // 새로운 사용자 접속시
                stompClient.current.subscribe('/topic/join', (clientOutput) => {
                    try {
                        const message = JSON.parse(clientOutput.body);

                        console.log('[LOG] /topic/join 새로운 클라이언트가 접속했습니다.', message.sessionId);
                        setClients(prevClients => [...prevClients, message.sessionId]);
                    } catch (error) {
                        console.error('Error parsing client data:', error);
                    }
                });
            };

            stompClient.current.activate();

            return () => {
                stompClient.current.deactivate();
            };
        };

        fetchDataAndInitializeWebSocket();
    }, [serverUrl]);


    const sendMessage = async () => {
        if (inputMessage === '') {
            alert('메세지를 입력해주세요.');
            return;
        }

        // 메시지 전송 (기존 코드)
        stompClient.current.publish({
            destination: "/pub/chat",
            body: JSON.stringify({
                data: inputMessage,
                channelId: '/topic/messages',
                timestamp: new Date().toLocaleTimeString(),
                ipAddress: ipAddress
            })
        });

        setInputMessage('');
    };

    // 클라이언트 상태를 props로 전달
    return (
        <ChatUI
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            sendMessage={sendMessage}
            messages={messages}
            clients={clients}
        />
    );
}
