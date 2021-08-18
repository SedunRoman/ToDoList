
let allTask = JSON.parse(localStorage.getItem('tasks')) || [];
let valueInput = '';
let input = null;

let add_error = document.getElementById('text_alert');


window.onload = async function init () {
    input = document.getElementById('add-task');
    input.addEventListener('change', updateValue);
    const resp = await fetch('http://localhost:8000/allTasks', {
        method: 'GET'
    });
    let result = await resp.json();
    allTask = result.data;
    render();
};

//Обработка пустой строки
onClickBtn = async () => {

    if(valueInput.length) {
        allTask.push({
            text: valueInput,
            isCheck: false
        });
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
        let result = await resp.json();
        allTask = result.data;
        localStorage.setItem('tasks', JSON.stringify(allTask));
        valueInput = '';
        input.value = '';
        render();
    }

    else {
        add_error.style.display = "block";
        input.style.border = "2px solid rgba(255, 0, 0, 0.4)";
    }
};

updateValue = (event) => {
    valueInput = event.target.value;
};

render = async () => {
    const content = document.getElementById('content-page');
    while(content.firstChild) {
        content.removeChild(content.firstChild);
    }

    if (!content.length) {
        content.style.display = "none";
    }
    allTask.sort((a, b) => a.isCheck > b.isCheck ? 1 : a.isCheck < b.isCheck ? -1 : 0);
    allTask.map((item, index) => {
        const container = document.createElement('div');
        container.id = `task-${index}`;
        container.className = 'task-container';

        //Чекбокс
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = item.isCheck;
        checkbox.onchange = function () {
            onChangeCheckbox(index);
        };

        container.appendChild(checkbox);

        //Текст
        const text = document.createElement('p');
        text.innerText = item.text;
        text.className = item.isCheck ? 'text-task done-text' : 'text-task';

        container.appendChild(text);

        //Кнопка добавить
        const BtnEdit = document.createElement('button');
        BtnEdit.className = 'button_edit';
        BtnEdit.onclick = function () {
            BtnEdit.style.display ="none";
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
                const resp = await fetch('http://localhost:8000/updateTask', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify({
                        id: allTask[index].id,
                        text: item.text
                    })
                });
                let result = await resp.json();
                allTask = result.data;
                localStorage.setItem('tasks', JSON.stringify(allTask));
            }

            onClickCancel = () => {
                test_Edit.remove();
                BtnEdit.style.display ="block";
            }

            container.appendChild(test_Edit);
        };
        container.appendChild(BtnEdit);

        //Кнопка удалить
        const BtnDelete = document.createElement('button');
        BtnDelete.className = 'button_del';
        BtnDelete.onclick = function () {
            onclicBtnDelete(index);
        };
        container.appendChild(BtnDelete);

        if (allTask[index].isCheck) {
            BtnEdit.style.display ="none";
            content.appendChild(container);
        }

        content.style.display = "block";
        content.appendChild(container);
    });
};

onChangeCheckbox = async (index) => {
    allTask[index].isCheck = !allTask[index].isCheck;
    const resp = await fetch('http://localhost:8000/updateTask', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            id: allTask[index].id,
            isCheck: allTask[index].isCheck
        })
    });
    let result = await resp.json();
    allTask = result.data;
    localStorage.setItem('tasks', JSON.stringify(allTask));
    render();
};

onclicBtnDelete = async (index) => {
    const resp = await fetch(`http://localhost:8000/deleteTask?id=${allTask[index].id}`, {
        method: 'DELETE',
    });
    const resp1 = await fetch('http://localhost:8000/allTasks', {
        method: 'GET'
    });
    let result = await resp.json();
    allTask = result.data;
    localStorage.setItem('tasks', JSON.stringify(allTask));
    render();
};