const API_BASE_URL = process.env.SERVER_URL + '/api';

export const addMenu = async (menu) => {
  try {
    const response = await fetch(API_BASE_URL + '/menus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(menu),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 응답 데이터를 JSON 형태로 변환합니다.
    return response.json();
  } catch (error) {
    // 에러를 콘솔에 출력하거나, 에러 처리 로직을 여기에 추가합니다.
    console.error('There was a problem with the fetch operation:', error.message);
    throw error; // 이 에러를 상위 호출자에게 전파합니다.
  }
};

export const fetchMenus = async () => {
  try {
    const response = await fetch(API_BASE_URL + '/menus', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Fetching menus failed: ", error);
    throw error;
  }
};

export const fetchRandomMenu = async () => {
  try {
    const response = await fetch(API_BASE_URL + '/menus/random', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // 응답 상태가 OK가 아닐 경우 에러를 발생시킵니다.
      throw new Error('Network response was not ok.');
    }

    return await response.json();
  } catch (error) {
    // 에러를 콘솔에 출력합니다.
    console.error('There has been a problem with your fetch operation:', error);

    // 에러를 UI에 표시하거나 사용자에게 알릴 다른 방법을 구현할 수 있습니다.
    throw error; // 혹은 사용자 정의 에러 처리를 할 수 있습니다.
  }
};

