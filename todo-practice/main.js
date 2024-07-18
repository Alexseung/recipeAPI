let hrs = document.getElementById('hrs');
let min = document.getElementById('min');
let sec = document.getElementById('sec');

let underline = document.getElementById('uderlinie');
let menus = document.querySelectorAll('section.task-area a');

let addButton = document.getElementById('add-button');
let taskInput = document.getElementById('task-input');
let showAll = document.getElementById('show-all');
let taskOngoing = document.getElementById('task-ongoing');
let taskDone = document.getElementById('task-done');
let taskList = [];
let filterList = []; //기본을 taskList로 잡고 isComplete에따라 새로운 배열에 넣기위한 배열
let pinnedList = [];
let currentTab = 'show-all';
//현재 어떤 tab에 있는지 나타낼 수 있고 해당 tab를 누르면 render()을 다시 실행해서 목록을 보여줌
showAll.addEventListener('click', () => {
  currentTab = 'show-all';
  render();
});

taskOngoing.addEventListener('click', () => {
  currentTab = 'task-ongoing';
  filter();
});

taskDone.addEventListener('click', () => {
  currentTab = 'task-done';
  filter();
});

// 즐겨찾기 pin기능
function pinTask(id) {
  // taskList, pinnedList 모두에서 해당 요소를 찾아야하기에 변수 두개 선언
  let taskIndex = taskList.findIndex(task => task.id === id);
  let pinnedIndex = pinnedList.findIndex(task => task.id === id);

  // taskList에서 찾았을 경우
  if (taskIndex !== -1) {
    //findIndex에서 이런식으로 해당 요소 존재여부 파악, 없으면 -1을 반환하기에 !== -1은 있다는 소리
    taskList[taskIndex].isPinned = !taskList[taskIndex].isPinned;

    // isPinned가 true이면 pinnedList에 추가하고 taskList에서 제거
    if (taskList[taskIndex].isPinned) {
      pinnedList.push(taskList[taskIndex]); //pinnedList에 추가하고
      taskList.splice(taskIndex, 1); //taskList에서를 자르기
    }

    render();
    console.log(pinnedList);
    console.log(taskList);
    return; //여기에서 꼭 끊어줘야함
  }

  // pinnedList에서 찾았을 경우
  if (pinnedIndex !== -1) {
    pinnedList[pinnedIndex].isPinned = !pinnedList[pinnedIndex].isPinned;

    // isPinned가 false이면 taskList에 추가하고 pinnedList에서 제거
    if (!pinnedList[pinnedIndex].isPinned) {
      taskList.push(pinnedList[pinnedIndex]); //taskList에 추가하고
      pinnedList.splice(pinnedIndex, 1); //pinnedList에서는 제거
    }

    render();
    console.log(pinnedList);
    console.log(taskList);
    return;
  }

  // taskList와 pinnedList에서 모두 해당 태스크를 찾지 못한 경우
  render(); // 그냥 render
  console.log(pinnedList);
  console.log(taskList);
}

function filter() {
  filterList = [];
  if (currentTab === 'task-ongoing') {
    for (let task of taskList) {
      if (task.isComplete === false) {
        filterList.push(task);
      }
    }
    render();
  } else if (currentTab === 'task-done') {
    for (let task of taskList) {
      if (task.isComplete === true) {
        filterList.push(task);
      }
    }
    render();
  }
}

addButton.addEventListener('click', addTask);
taskInput.addEventListener('keydown', handleKeyDown);
function handleKeyDown(event) {
  if (event.key === 'Enter') {
    addTask();
  }
}

function addTask() {
  if (taskInput.value == '') {
    alert('할 일을 써넣으셔야죠!');
    return;
  }
  let isDuplicate = taskList.some(task => task.taskContent === taskInput.value); //some은 조건에 맞는게 하나라도 있으면 true반환
  if (isDuplicate) {
    alert('이미 추가된 할 일입니다!');
    taskInput.value = '';
    return; //render();를 처음에 넣어버려서 수정하기까지 시간 낭비함..
  }
  let task = {
    id: randomIdGenerate(),
    taskContent: taskInput.value,
    isComplete: false,
    isPinned: false,
    dueDate: '',
  };
  taskList.push(task);
  console.log(taskList);
  taskInput.value = '';
  render();
}

function render() {
  let list = [];
  if (currentTab === 'show-all') {
    list = [...pinnedList, ...taskList];
  } else if (currentTab === 'task-ongoing') {
    list = [
      ...pinnedList.filter(task => !task.isComplete && task.isPinned),
      ...taskList.filter(task => !task.isComplete && !task.isPinned),
    ];
  } else if (currentTab === 'task-done') {
    list = [
      ...pinnedList.filter(task => task.isComplete),
      ...taskList.filter(task => task.isComplete),
    ];
  }
  let resultHTML = '';
  for (let i = 0; i < list.length; i++) {
    if (list[i].isComplete == true) {
      resultHTML += `<div class="task task-done">
              <div>${list[i].taskContent} </div>
              <div>
                <i class="fa-solid fa-rotate-left" onClick="checkBtn('${list[i].id}')"></i>
                <i class="fa-solid fa-trash" onClick="deleteBtn('${list[i].id}')"></i>
              </div>
            </div>`;
    } else {
      resultHTML += `<div class="task ${list[i].isPinned ? 'pinned-task' : ''}">
                <div>${list[i].taskContent}</div>
                <div>
                  <i class="fa-solid fa-thumbtack" onClick="pinTask('${
                    list[i].id
                  }')"></i>
                  <i class="fa-solid fa-calendar-days" onClick='dueDate()'></i>
                  <i class="fa-solid fa-check" onClick="checkBtn('${
                    list[i].id
                  }')"></i>
                  <i class="fa-solid fa-trash" onClick="deleteBtn('${
                    list[i].id
                  }')"></i>
                </div>
              </div>`;
    }
  }
  document.getElementById('task-board').innerHTML = resultHTML;
}

// 마감일 지정
function dueDate(id) {
  let myModal = new bootstrap.Modal(document.getElementById('exampleModal'), {
    keyboard: false,
  });
  myModal.show();
}

function saveDate(id) {
  let myModal = bootstrap.Modal.getInstance(
    document.getElementById('exampleModal')
  );
  myModal.hide();
  render();
}

//Check toggle
function checkBtn(id) {
  let foundPinned = false;
  for (let i = 0; i < pinnedList.length; i++) {
    if (pinnedList[i].id === id) {
      pinnedList[i].isComplete = !pinnedList[i].isComplete;
      foundPinned = true;
      break;
    }
  }
  for (i = 0; i < taskList.length; i++) {
    if (taskList[i].id == id) {
      taskList[i].isComplete = !taskList[i].isComplete;
      break;
    }
  }
  if (currentTab === 'task-ongoing') {
    (filterList = pinnedList.filter(task => !task.isComplete && task.isPinned)),
      taskList.filter(task => !task.isComplete); //false가 filterList에 남아있게
  } else if (currentTab === 'task-done') {
    (filterList = pinnedList.filter(task => task.isComplete && !task.isPinned)),
      taskList.filter(task => task.isComplete); //true가 filterList에 남아있게
  }
  console.log(filterList);
  render();
}

//코알누 유튜브에서 filter가 나와서 filter로 코드 짧게 바꿈
function deleteBtn(id) {
  taskList = taskList.filter(task => task.id !== id);
  console.log(taskList);
  pinnedList = pinnedList.filter(task => task.id !== id);
  console.log(pinnedList);
  if (currentTab === 'show-all') {
    render();
  } else {
    filter();
  }
  // for (i = 0; i < taskList.length; i++) {
  //   if (taskList[i].id == id) {
  //     taskList.splice(i, 1);
  //     break;
  //   }
  // }
  // console.log(taskList);
  // render();
}

function randomIdGenerate() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

//시계
setInterval(() => {
  let currentTime = new Date();

  hrs.innerHTML =
    (currentTime.getHours() < 10 ? '0' : '') + currentTime.getHours();
  min.innerHTML =
    (currentTime.getMinutes() < 10 ? '0' : '') + currentTime.getMinutes();
  sec.innerHTML =
    (currentTime.getSeconds() < 10 ? '0' : '') + currentTime.getSeconds();
}, 1000);

//메뉴 언더라인
menus.forEach(menu =>
  menu.addEventListener('click', e => horizontalIndicator(e))
);

function horizontalIndicator(e) {
  underline.style.left = e.currentTarget.offsetLeft + 'px';
  underline.style.width = e.currentTarget.offsetWidth + 'px';
  underline.style.top =
    e.currentTarget.offsetTop + e.currentTarget.offsetHeight - 5 + 'px';
}
