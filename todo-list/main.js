let underline = document.getElementById('underline');
let menus = document.querySelectorAll('section.task-area a');

let taskInput = document.getElementById('task-input');
let addBtuttom = document.getElementById('add-button');
let taskList = [];

addBtuttom.addEventListener('click', addTask);
function addTask() {
  let taskContent = taskInput.value;
  taskList.push(taskContent);
  console.log(taskList);
  render();
}

function render() {
  let resultHTML = '';
  for (let i = 0; i < taskList.length; i++) {
    resultHTML += `<div class="task">
            <div>${taskList[i]}</div>
            <div>
              <button>Check</button>
              <button>Delete</button>
            </div>
          </div>`;
  }

  document.getElementById('task-board').innerHTML = resultHTML;
}

// underline작업
menus.forEach(menu =>
  menu.addEventListener('click', e => horizontalIndicator(e))
);

function horizontalIndicator(e) {
  underline.style.left = e.currentTarget.offsetLeft + 'px';
  underline.style.width = e.currentTarget.offsetWidth + 'px';
  underline.style.top =
    e.currentTarget.offsetTop + e.currentTarget.offsetHeight + 'px';
}
