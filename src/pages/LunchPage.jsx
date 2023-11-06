import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {addMenu, fetchMenus, fetchRandomMenu} from "../feature/menu/api/menuApi";

const RESULT_START_HOUR = 11;
const RESULT_START_MINUTE = 40;
const RESULT_END_HOUR = 12;
const RESULT_END_MINUTE = 0;

const MENU_INPUT_START_HOUR = 9;
const MENU_INPUT_START_MINUTE = 0;
const MENU_INPUT_END_HOUR = 11;
const MENU_INPUT_END_MINUTE = 30;

const LunchPage = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [menuInput, setMenuInput] = useState('');
  const [menus, setMenus] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState('');

  const onClickAddBtn = async () => {
    const startTime = new Date();
    startTime.setHours(MENU_INPUT_START_HOUR, MENU_INPUT_START_MINUTE, 0);
    const endTime = new Date();
    endTime.setHours(MENU_INPUT_END_HOUR, MENU_INPUT_END_MINUTE, 0);

    if (currentTime >= startTime && currentTime < endTime && menuInput) {
      try {
        const newMenu = await addMenu({ name: menuInput });
        // 메뉴 목록 상태 업데이트
        setMenus(prevMenus => [...prevMenus, newMenu]);
        setMenuInput(''); // 입력 필드 초기화
        alert('메뉴가 추가되었습니다.');
      } catch (error) {
        alert(`메뉴 추가 중 오류가 발생했습니다: ${error.message}`);
        console.error(error);
      }
    } else {
      alert(`메뉴 입력 시간은 오전 ${MENU_INPUT_START_HOUR}시부터 오후 ${MENU_INPUT_END_HOUR}:${MENU_INPUT_END_MINUTE}까지입니다.`);
    }
  };

  const onClickStartBtn = async () => {
    const currentTime = new Date();
    const resultStartTime = new Date();
    resultStartTime.setHours(RESULT_START_HOUR, RESULT_START_MINUTE, 0);
    const resultEndTime = new Date();
    resultEndTime.setHours(RESULT_END_HOUR, RESULT_END_MINUTE, 0);

    if (currentTime >= resultStartTime && currentTime < resultEndTime) {
      try {
        const randomMenu = await fetchRandomMenu(); // fetchRandomMenu 함수는 이전에 정의해야 합니다.
        setSelectedMenu(randomMenu.name);
      } catch (error) {
        alert(`메뉴를 가져오는 데 실패했습니다: ${error.message}`);
        console.error(error);
      }
    } else {
      alert('결과를 확인할 수 있는 시간이 아닙니다.');
    }
  };

  useEffect(() => {
    // 메뉴 데이터를 가져오는 함수를 호출하는 부분
    const loadMenus = async () => {
      try {
        const fetchedMenus = await fetchMenus();
        setMenus(fetchedMenus); // 가져온 메뉴 데이터로 상태를 업데이트
      } catch (error) {
        alert(`메뉴를 가져오는 데 실패했습니다: ${error.message}`);
        console.error(error);
      }
    };

    loadMenus(); // 함수 실행
  }, []);

  // 현재 시간 업데이트 함수
  useEffect(() => {
    const timerId = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  return (
    <div>
      <h2>현재 시각: {currentTime.toLocaleTimeString()}</h2>
      <div>
        <label>
          점심 메뉴 추가:
          <input
            type="text"
            value={menuInput}
            onChange={(e) => setMenuInput(e.target.value)}
          />
        </label>
        <button onClick={onClickAddBtn}>추가</button>
      </div>
      <div>
        <p>추가된 메뉴 수: {menus.length}</p>
      </div>
      <StartButton
        aria-label="게임 시작"
        aria-live="assertive"
        onClick={onClickStartBtn}
      >
        결과 확인
      </StartButton>
      {selectedMenu && <p>오늘의 점심 메뉴: {selectedMenu}</p>}
    </div>
  );
};

export default LunchPage;

const StartButton = styled.button`
  font-size: 5rem;
  font-weight: 600;
  color: white;
  background-color: orange;
  width: 25rem;
  height: 10rem;
  border-radius: 10px;
  transition: 0.2s ease-in;

  &:hover,
  &:focus {
    transition: 0.2s ease-in;
    transform: scale(1.1);
  }

  &:focus {
    box-shadow: 0 0 1px 2px white, 0 0 1px 5px orange;
  }

  @media ${({ theme }) => theme.mobile} {
    font-size: 2rem;
    width: 10rem;
    height: 5rem;
  }
`;
