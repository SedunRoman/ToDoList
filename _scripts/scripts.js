
let allTask = JSON.parse(localStorage.getItem('tasks')) || [];
let valueInput = '';
let input = null;

let add_error = document.getElementById('text_alert');


window.onload = function init () {
    input = document.getElementById('add-task');
    input.addEventListener('change', updateValue);
    render();
};

//Обработка пустой строки
onClickBtn = () => {

    if(valueInput.length) {
        allTask.push({
            text: valueInput,
            isCheck: false
        });
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

render = () => {
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
            onClickEdit = () => {
                let input_add = document.getElementById('add-task2');
                text.innerText = input_add.value;
                item.text = input_add.value;
                test_Edit.remove();
                BtnEdit.style.display ="block";
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

onChangeCheckbox = (index) => {
    allTask[index].isCheck = !allTask[index].isCheck;
    localStorage.setItem('tasks', JSON.stringify(allTask));
    render();
};

onclicBtnDelete = (index) => {
    allTask.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(allTask));
    render();
};