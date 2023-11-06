import React, {useEffect, useRef} from 'react';
import styled from 'styled-components';

const MainContainer = styled.div`
  display: flex;
  max-width: 900px; // Or any desired max-width
  width: 100%;
  height: 100vh;
  margin: 0 auto;
  font-family: Arial, sans-serif;
`;

const ChatSection = styled.div`
  flex: 0.7; // takes up 70% of the container width
  padding: 20px;
  background-color: #f8f8f8;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
`;

const ClientSection = styled.div`
  flex: 0.3; // takes up 30% of the container width
  background-color: #f0f0f0;
  padding: 20px;
  overflow-y: auto;
  border-left: 1px solid #ccc;
`;

const ChatHeader = styled.h1`
  color: #e91e63;
  font-size: 24px;

  @media (max-width: 600px) {
    font-size: 20px;
  }
`;

const MessageInput = styled.input`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
  width: 70%;
  margin-right: 10px;

  @media (max-width: 600px) {
    width: 60%;
  }
`;

const SendButton = styled.button`
  padding: 10px 20px;
  background-color: #4CAF50;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  @media (max-width: 600px) {
    padding: 8px 16px;
    font-size: 14px;
  }
`;

const MessagesContainer = styled.div`
    max-height: 500px;  // 변경된 값
    overflow-y: auto;
    text-align: left;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    background-color: #fff;

    @media (max-width: 600px) {
        max-height: 300px;  // 필요한 경우 여기도 조정
    }

    @media (min-width: 601px) and (max-width: 900px) {
        max-height: 400px;  // 필요한 경우 여기도 조정
    }
`;


const Message = styled.div`
  background-color: #4CAF50;
  color: #fff;
  padding: 10px;
  border-radius: 5px;
  margin: 5px 0;

  @media (max-width: 600px) {
    padding: 8px;
  }
`;

const MessageWithTimestamp = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  & > div {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
`;



// IP 주소 마스킹 함수
const maskIpAddress = (ipAddress) => {
    const ipParts = ipAddress.split('.');
    if (ipParts.length === 4) {
        ipParts[2] = 'x';
        ipParts[3] = 'x';
        return ipParts.join('.');
    }
    return ipAddress;
};

// Example usage
const ChatUI = ({ inputMessage, setInputMessage, sendMessage, messages, clients }) => {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // 메시지가 추가될 때마다 스크롤을 최하단으로 이동
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
    }, [messages]);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    useEffect(() => {
        // 메시지가 추가될 때마다 스크롤을 최하단으로 이동
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <MainContainer>
            <ChatSection>
                <ChatHeader>💗Jonghyun2.com에 오신것을 환영합니다.💗</ChatHeader>
                <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MessageInput
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                    />
                    <SendButton onClick={sendMessage}>
                        Send
                    </SendButton>
                </div>
                <MessagesContainer ref={messagesEndRef}>
                    {messages.map((message, index) => (
                        <Message key={index}>
                            <MessageWithTimestamp>
                                <span>{message.data}</span>
                                <div>
                                    <span>{message.timestamp}</span>
                                    {message.ipAddress && <span>{maskIpAddress(message.ipAddress)}</span>}
                                </div>
                            </MessageWithTimestamp>
                        </Message>
                    ))}
                </MessagesContainer>
            </ChatSection>
            <ClientSection>
                <h2>Online Clients</h2>
                {clients.map((client, index) => (
                    <p key={index}>{client}</p>
                ))}
            </ClientSection>
        </MainContainer>
    );
};

export default ChatUI;
