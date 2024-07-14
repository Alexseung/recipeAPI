const API_KEY = '62fc00364bd146588740';
const serviceId = 'COOKRCP01';
const dataType = 'json';
let startIdx = 1;
let endIdx = 10;
let url = new URL(
  `https://openapi.foodsafetykorea.go.kr/api/${API_KEY}/${serviceId}/${dataType}/${startIdx}/${endIdx}`
);

let recipeList = [];

async function getData() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log('data', data);
    recipeList = data.COOKRCP01.row; // 레시피 리스트 저장
    console.log('recipeList', recipeList);
    render();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

const render = () => {
  let recipeHTML = recipeList.map(recipe => {
    return `
      <div>
        <h2>${recipe.RCP_NM}</h2> <!-- 레시피 이름 -->
        <img src="${recipe.MANUAL_IMG02}" alt="레시피 이미지"> <!-- 레시피 이미지 -->
        <p>${recipe.RCP_PARTS_DTLS}</p> <!-- 레시피 재료 -->
        <p>${recipe.MANUAL01}</p> <!-- 레시피 설명 -->
        <p>${recipe.MANUAL02}</p> <!-- 레시피 설명 -->
        <p>${recipe.MANUAL03}</p> <!-- 레시피 설명 -->
        <p>${recipe.MANUAL04}</p> <!-- 레시피 설명 -->
      </div>
    `;
  });

  document.getElementById('recipe-board').innerHTML = recipeHTML.join('');
};

getData();
