import React from 'react';
import styled from 'styled-components';

const ChatContainer = styled.div`
  font-family: Arial, sans-serif;
  max-width: 400px;
  margin: 0 auto;
  text-align: center;
  padding: 20px;
  background-color: #f8f8f8;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
`;

const ChatHeader = styled.h1`
  color: #e91e63;
  font-size: 24px;
`;

const MessageInput = styled.input`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
  width: 70%;
  margin-right: 10px;
`;

const SendButton = styled.button`
  padding: 10px 20px;
  background-color: #4CAF50;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
`;

const MessagesContainer = styled.div`
  max-height: 300px;
  overflow-y: auto;
  text-align: left;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #fff;
`;

const Message = styled.div`
  background-color: #4CAF50;
  color: #fff;
  padding: 10px;
  border-radius: 5px;
  margin: 5px 0;
`;

const MessageWithTimestamp = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

// Example usage
const ChatUI = ({ inputMessage, setInputMessage, sendMessage, messages }) => (
    <ChatContainer>
        <ChatHeader>💗Jonghyun2.com에 오신것을 환영합니다.💗</ChatHeader>
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MessageInput
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type a message..."
            />
            <SendButton onClick={sendMessage}>
                Send
            </SendButton>
        </div>
        <MessagesContainer>
            {messages.map((message, index) => (
                <Message key={index}>
                    <MessageWithTimestamp>
                        <span>{message.content}</span>
                        <span>{message.timestamp}</span>
                        <span>{message.ipAddress}</span>
                    </MessageWithTimestamp>
                </Message>
            ))}
        </MessagesContainer>
    </ChatContainer>
);

export default ChatUI;
