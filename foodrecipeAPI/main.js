let userInput = document.querySelector('.user-input'); //input창에 있는 거
let searchBtn = document.getElementById('search-btn'); // 검색 버튼

// 검색버튼 누르면 recipe에 input창에 입력한 것을 저장
//getDat라는 레시피들 불러오는 것의 매개변수를 recipe가 갖게됨
searchBtn.addEventListener('click', () => {
  recipe = userInput.value;
  getData(recipe);
});
//레시피 리스트는 배열에 저장
let recipeList = [];

const API_ID = `01bfaed3`;
const API_KEY = `f76a8dd1feb49872198a8499513ec02a`;

let url = new URL(
  `https://api.edamam.com/search?app_id=${API_ID}&app_key=${API_KEY}`
);

// 레시피 불러오는 함수
//q는 레시피 검색할때 요리 이름을 검색하는 것이고 q=recipe 즉 내가 input창에 입력하고 검색누른 것을 검색
async function getData() {
  url.searchParams.set('q', recipe);
  const response = await fetch(url);
  const data = await response.json();
  recipeList = data.hits;
  render();
  console.log('data', data);
  console.log('recipeList', recipeList);
}

getData();

// recipeList를 map으로 하나씩 돌며 배열로 return함
// 배열 안에 있는 것들 하나씩 꺼내서 화면에 보여줄 수 있게함
// label은 음식이름
// image는 음식 사진
// 그 외 정보들 하나씩 불러와주고 css정리
// join('')으로 배열 요소들 문자열로
function render() {
  let recipeHTML = recipeList
    .map(dish => {
      let calories = Math.floor(dish.recipe.calories);
      return `<div>${dish.recipe.label}</div>
      <img src="${dish.recipe.image}"
      <div>지역 ${dish.recipe.cuisineType}</div>
      <div>칼로리 ${calories}</div>
      `;
    })
    .join('');
  document.getElementById('recipe-board').innerHTML = recipeHTML;
}
