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

    const serverUrl = process.env.SERVER_URL + '/websocket';

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
                console.log("연결완료")
                // 기존 메시지 구독 코드
                stompClient.current.subscribe('/topic/messages', (messageOutput) => {
                    console.log("서버로부터 메세지가 도착했습니다.")
                    setMessages((prevMessages) => [...prevMessages, JSON.parse(messageOutput.body)]);
                });

                stompClient.current.subscribe('/topic/clients', (clientOutput) => {
                    console.log(clientOutput)
                    try {
                        // Parse the received JSON string to an object (here: array)
                        const receivedClients = JSON.parse(clientOutput.body);

                        // Update the state with the received data
                        setClients(receivedClients);
                    } catch (error) {
                        // Log any error during the JSON parsing to the console
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
            destination: "/app/chat",
            body: JSON.stringify({
                content: inputMessage,
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
