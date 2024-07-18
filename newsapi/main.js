//newsAPI 불러오기
//HTML에 기사 내용 작성
//메뉴 버튼 활성화
//모바일 화면 사이드 메뉴 버튼 활성화
//검색(keyword) 기능
//에러 보여주기 (검색 안되는 경우 에러창)

//20240712 로고 누르면 홈 버튼, 활성화된 카테고리 표시

let search = document.querySelector('.search');
let searchArea = document.querySelector('.search-area');
let inputArea = document.getElementById('input-area');
let searchBtn = document.querySelector('.search-button');
let menus = document.querySelectorAll('.menus button'); //지금 menus는 array임
let sideMenus = document.querySelectorAll('#side-menu li a');
let searchInput = document.getElementById('search-input');
let darkMode = document.querySelector('.dark-mode');

//다크모드
darkMode.addEventListener('click', () => {
  document.body.classList.toggle('dark-light');
});

//pagination
let totalResults = 0;
let page = 1;
const pageSize = 10;
const groupSize = 5;

//apikey, url, newsList
const API_KEY = `203207a5e7ec4700b1717e879ed1396a`;
const originURL = `https://newsapi.org/v2/top-headlines?`;
const noonaURL = `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?`;
let url = new URL(
  // `${originURL}country=kr&pageSize=10&apikey=${API_KEY}`
  `${noonaURL}country=kr&pageSize=10`
);
let newsList = [];

//사이드바
sideMenus.forEach(menu =>
  menu.addEventListener('click', event => getNewsByCategory(event))
);

//상단 메뉴
menus.forEach(menu =>
  menu.addEventListener('click', event => getNewsByCategory(event))
);

//인풋창
searchInput.addEventListener('focus', () => {
  searchInput.value = '';
});
searchInput.addEventListener('keydown', handleKeyDown);
function handleKeyDown(event) {
  if (event.key === 'Enter') {
    getNewsByKeyword();
    searchInput.value = '';
  }
}

//로고 누르면 홈으로
async function home() {
  url = new URL(
    // `${originURL}country=kr&pageSize=10&pageSize=${pageSize}&apikey=${API_KEY}`
    `${noonaURL}country=kr&pageSize=10`
  );
  previousCategory.classList.remove('clicked');
  page = 1;
  await getNews();
}

//뉴스 불러오기 (error catch)
const getNews = async () => {
  try {
    url.searchParams.set('page', page);
    url.searchParams.set('pageSize', pageSize);

    const response = await fetch(url);
    const data = await response.json();
    console.log('data', data);
    if (response.status === 200) {
      if (data.articles.length === 0) {
        throw new Error('No result for this search');
      }
      newsList = data.articles;
      totalResults = data.totalResults;
      render();
      paginationRender();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    errorRender(error.message);
  }
};

// 뉴스 불러오기
const getLatestNews = async () => {
  url = new URL(
    // `${originURL}country=kr&pageSize=${pageSize}&apikey=${API_KEY}`
    `${noonaURL}country=kr&pageSize=10`
  );
  await getNews();
};
getLatestNews();

//카테고리 선택 (활성화된 카테고리 표시)
let previousCategory = null;
const getNewsByCategory = async event => {
  const category = event.target.textContent.toLowerCase();
  const currentCategory = event.target;
  if (previousCategory) {
    previousCategory.classList.remove('clicked');
  }
  currentCategory.classList.add('clicked');
  previousCategory = currentCategory;

  console.log('category', category);
  url = new URL(
    // `${originURL}country=kr&category=${category}&pageSize=${pageSize}&apikey=${API_KEY}`
    `${noonaURL}country=kr&pageSize=10&category=${category}`
  );
  page = 1;

  await getNews();
};

//키워드 검색
const getNewsByKeyword = async () => {
  const keyword = document.getElementById('search-input').value;
  console.log('keyword', keyword);
  url = new URL(
    // `${originURL}country=kr&q=${keyword}&apikey=${API_KEY}`
    `${noonaURL}country=kr&pageSize=10&q=${keyword}`
  );
  page = 1;

  await getNews();
};

//search icon을 활용한 input창 활성화
search.addEventListener('click', function () {
  if (searchArea.style.display === 'none' || searchArea.style.display === '') {
    searchArea.style.display = 'flex';
  } else {
    searchArea.style.display = 'none';
  }
});

//기사 UI
const render = () => {
  let newsHTML = newsList
    .map(news => {
      return `<div class="row news">
            <div class="col-lg-4">
              <img
                class="news-img-size"
                src="${news.urlToImage || 'images/No_Image_Available.jpg'}"
                alt="News Image"
                onerror="this.onerror=null;this.src='images/No_Image_Available.jpg';"
              />
            </div>
            <div class="col-lg-8">
              <h2>${news.title}</h2>
               <p>${
                 news.description == null || news.description == ''
                   ? '내용없음'
                   : news.description.length > 200
                   ? news.description.substring(0, 200) + '...'
                   : news.description
               }</p>
              <div>${news.source.name || 'No source'} * ${moment(
        news.publishedAt
      ).fromNow()}</div>
            </div>
          </div>`;
    })
    .join('');

  document.getElementById('news-board').innerHTML = newsHTML; // articles 요소에 HTML 삽입
};

//에러 메세지
const errorRender = errorMessage => {
  const errorHTML = `<div class="alert alert-danger" role="alert">
  ${errorMessage}
</div>`;

  document.getElementById('news-board').innerHTML = errorHTML;
};

//페이지 표시
const paginationRender = () => {
  const totalPages = Math.ceil(totalResults / pageSize);
  const pageGroup = Math.ceil(page / groupSize);
  let lastPage = pageGroup * groupSize;
  if (lastPage > totalPages) {
    lastPage = totalPages;
  }
  const firstPage =
    lastPage - (groupSize - 1) <= 0 ? 1 : lastPage - (groupSize - 1);

  let paginationHTML = ``;
  if (page > 1 && totalPages > 2) {
    paginationHTML = `<li class="page-item"><a class="page-link" onClick='moveToPage(1)'>&lt&lt</a></li>
    <li class="page-item"><a class="page-link" onClick=(moveToPage(${
      page - 1
    }))>&lt</a></li>`;
  } else if (totalPages > 1 && totalPages < 3) {
    paginationHTML += `<li class="page-item"><a class="page-link" onClick=(moveToPage(${
      page - 1
    }))>&lt</a></li>`;
  }

  for (let i = firstPage; i <= lastPage; i++) {
    paginationHTML += `<li class="page-item ${
      i === page ? 'active' : ''
    }" onClick="moveToPage(${i})"><a class="page-link">${i}</a></li>`;
  }
  if (page < totalPages && totalPages > 2) {
    paginationHTML += `<li class="page-item"><a class="page-link" onClick=(moveToPage(${
      page + 1
    }))>&gt</a></li>
        <li class="page-item"><a class="page-link" onClick=(moveToPage(${totalPages}))>&gt&gt</a></li>
    `;
  } else if (totalPages > 1 && totalPages < 3) {
    paginationHTML += `<li class="page-item"><a class="page-link" onClick=(moveToPage(${
      page + 1
    }))>&gt</a></li>`;
  }
  document.querySelector('.pagination').innerHTML = paginationHTML;

  //   <nav aria-label="Page navigation example">
  //   <ul class="pagination">
  //     <li class="page-item">
  //       <a class="page-link" href="#" aria-label="Previous">
  //         <span aria-hidden="true">&laquo;</span>
  //       </a>
  //     </li>
  //     <li class="page-item"><a class="page-link" href="#">1</a></li>
  //     <li class="page-item"><a class="page-link" href="#">2</a></li>
  //     <li class="page-item"><a class="page-link" href="#">3</a></li>
  //     <li class="page-item">
  //       <a class="page-link" href="#" aria-label="Next">
  //         <span aria-hidden="true">&raquo;</span>
  //       </a>
  //     </li>
  //   </ul>
  // </nav>
};
const moveToPage = pageNum => {
  console.log('move', pageNum);
  page = pageNum;
  getNews();
};
getLatestNews();
