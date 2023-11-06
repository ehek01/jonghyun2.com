import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div>
      <h1>홈페이지</h1>
      <Link to="/chat">채팅방 입장</Link><br />
      <Link to="/lunch">오늘의 점심</Link>
    </div>
  );
}
