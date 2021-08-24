let allTask = JSON.parse(localStorage.getItem('tasks')) || [];
let valueInput = '';
let input = null;
let add_error = document.getElementById('text_alert');
let clearAll = document.getElementById('content-clear');
window.onload = async function init() {
  input = document.getElementById('add-task');
  input.addEventListener('change', updateValue);
  const resp = await fetch('http://localhost:8000/allTasks', {
    method: 'GET'
  });
  const result = await resp.json();
  allTask = result.data;
  render();
};
const onClickBtn = async () => {
  if (valueInput.length) {
    const resp = await fetch('http://localhost:8000/createTask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        text: valueInput,
        isCheck: false
      })
    });
    const result = await resp.json();
    allTask = result.data;
    localStorage.setItem('tasks', JSON.stringify(allTask));
    valueInput = '';
    input.value = '';
    render();
  } else {
    add_error.style.display = "block";
    input.style.border = "2px solid rgba(255, 0, 0, 0.4)";
  }
};
const updateValue = (event) => {
  valueInput = event.target.value;
};
render = async () => {
  const content = document.getElementById('content-page');
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }
  if (!content.length) {
    content.style.display = "none";
    clearAll.style.display = "none";
  }
  allTask.sort((a, b) => a.isCheck > b.isCheck ? 1 : a.isCheck < b.isCheck ? -1 : 0);
  allTask.map((item, index) => {
    const container = document.createElement('div');
    container.id = `task-${index}`;
    container.className = 'task-container';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = item.isCheck;
    checkbox.onchange = () => {
      onChangeCheckbox(index);
    };
    container.appendChild(checkbox);
    const text = document.createElement('p');
    text.innerText = item.text;
    text.className = item.isCheck ? 'text-task done-text' : 'text-task';
    container.appendChild(text);
    const btnEdit = document.createElement('button');
    btnEdit.className = 'button_edit';
    btnEdit.onclick = () => {
      btnEdit.style.display = "none";
      const test_Edit = document.createElement('div');
      test_Edit.className = 'test_edit';
      test_Edit.innerHTML = `
            <input type="text" id="add-task2" value='${item.text}'/>
            <button type="button" class="btn-add" onclick="onClickEdit()">Add</button>
            <button type="button" class="btn-cancel" onclick="onClickCancel()">Back</button>
            `
      onClickEdit = async () => {
        let input_add = document.getElementById('add-task2');
        text.innerText = input_add.value;
        item.text = input_add.value;
        test_Edit.remove();
        btnEdit.style.display = "block";
        const resp = await fetch('http://localhost:8000/updateTask', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({
            _id: allTask[index]._id,
            text: item.text
          })
        });
        const result = await resp.json();
        allTask = result.data;
        localStorage.setItem('tasks', JSON.stringify(allTask));
      }
      onClickCancel = () => {
        test_Edit.remove();
        btnEdit.style.display = "block";
      }
      container.appendChild(test_Edit);
    };
    container.appendChild(btnEdit);
    const BtnDelete = document.createElement('button');
    BtnDelete.className = 'button_del';
    BtnDelete.onclick = () => {
      onclicBtnDelete(index);
    };
    container.appendChild(BtnDelete);
    if (allTask[index].isCheck) {
      btnEdit.style.display = "none";
      content.appendChild(container);
    }
    content.style.display = "block";
    clearAll.style.display = "block";
    content.appendChild(container);
  });
};
const onChangeCheckbox = async (index) => {
  const { _id, isCheck } = allTask[index];
  allTask[index].isCheck = !allTask[index].isCheck;
  const resp = await fetch('http://localhost:8000/updateTask', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      _id,
      isCheck
    })
  });
  const result = await resp.json();
  allTask = result.data;
  localStorage.setItem('tasks', JSON.stringify(allTask));
  render();
};
const onclicBtnDelete = async (index) => {
  const resp = await fetch(`http://localhost:8000/deleteTask?_id=${allTask[index]._id}`, {
    method: 'DELETE',
  });
  const result = await resp.json();
  allTask = result.data;
  localStorage.setItem('tasks', JSON.stringify(allTask));
  render();
};
const onClickBtnClear = async (index) => {
  const resp = await fetch(`http://localhost:8000/deleteAllTask`, {
    method: 'DELETE',
  });
  const result = await resp.json();
  allTask = result.data;
  localStorage.setItem('tasks', JSON.stringify(allTask));
  render();
};