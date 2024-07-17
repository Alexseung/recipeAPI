const API_KEY = '62fc00364bd146588740';
const serviceId = 'COOKRCP01';
const dataType = 'json';
let startIdx = 1;
let endIdx = 100;
let recipeList = [];
let originUrl = new URL(
  `https://openapi.foodsafetykorea.go.kr/api/${API_KEY}/${serviceId}/${dataType}/${startIdx}/${endIdx}`
);

// 열량 확인
// 체크박스에 있는 값확인
// 그 값 이하의 것들을 다 출력하는 url만들기

const EngCheckboxes = document.querySelectorAll('input[name="INFO_ENG"]');

EngCheckboxes.forEach(checkbox => {
  checkbox.addEventListener('click', async function () {
    // 현재 클릭된 체크박스가 체크된 상태인지 확인
    const isChecked = this.checked;

    // 모든 체크박스를 순회하며 현재 클릭된 체크박스 이외의 체크박스들을 unchecked로 변경
    EngCheckboxes.forEach(cb => {
      if (cb !== this) {
        cb.checked = false;
      }
    });

    // 현재 클릭된 체크박스 옆에 있는 <div> 요소의 텍스트 내용에서 숫자만 추출하여 출력
    const divText = this.nextElementSibling.textContent.trim();
    const numberOnly = parseInt(divText.replace(/[^0-9]/g, '')); // 숫자만 추출하여 정수로 변환

    console.log(`Number Only: ${numberOnly}`);
    let url = `${originUrl}`;

    try {
      // 데이터를 fetch로 받아옴
      const response = await fetch(url);
      const data = await response.json();
      console.log('data', data);

      // recipeList에 데이터를 저장
      const recipeList = data.COOKRCP01.row;

      // INFO_ENG 값이 numberOnly보다 작은 레시피 필터링
      const filteredRecipes = recipeList.filter(
        recipe => parseInt(recipe.INFO_ENG) < numberOnly
      );

      // 필터링된 레시피를 화면에 표시
      const engHTML = filteredRecipes
        .map(recipe => {
          return `
          <div>
          ${recipe.RCP_NM}
            <img
            src="${recipe.ATT_FILE_NO_MAIN}"
            alt="Recipe Image"
            class="food-img"
          />
          </div>
        `;
        })
        .join(''); // join()을 사용하여 하나의 문자열로 변환

      document.getElementById('diet-img').innerHTML = engHTML;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  });
});

let recipeBoard = document.getElementById('recipe-board');
let userInput = document.getElementById('user-input');

let searchBtn = document.getElementById('search-button');
userInput.addEventListener('keydown', handleKeyDown);
function handleKeyDown(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    keyWord(e);
  }
}

searchBtn.addEventListener('click', keyWord);
function keyWord(e) {
  e.preventDefault();
  const recipeName = document.getElementById('user-input').value;
  getRecipes(recipeName);
}

async function getRecipes(recipeName) {
  try {
    let url = `${originUrl}/RCP_NM=${recipeName}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log('data', data);
    recipeList = data.COOKRCP01.row; // Store recipe list
    console.log('recipeList', recipeList);
    render();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

const render = () => {
  recipeBoard.innerHTML = '';
  let recipeHTML = recipeList.map(recipe => {
    let manualHTML = '';
    let order = 1; // 순서 추적 변수

    for (let i = 1; i <= 20; i++) {
      let number = i < 10 ? '0' + i : i;
      let manualNum = recipe['MANUAL' + number];

      if (manualNum && manualNum.trim() !== '') {
        // MANUAL 항목의 첫 번째 숫자를 현재 order로 대체
        manualNum = manualNum.replace(/^\d+/, order);
        manualHTML += `<p>${manualNum}</p>`;
        order++; // 순서를 증가시킴
      }
    }

    return `
    <div class="row show-recipe">
          <div class="col-lg-4">
            <img
            src="${recipe.ATT_FILE_NO_MAIN}"
            alt="Recipe Image"
            class="food-img"
          />
          </div>
          <div class="col-lg-8">
            <h2>${recipe.RCP_NM}</h2>
            <p>${recipe.RCP_PARTS_DTLS}</p>
          ${manualHTML}
            
          </div>
        </div>

    `;
  });

  recipeBoard.innerHTML = recipeHTML.join('');
};
