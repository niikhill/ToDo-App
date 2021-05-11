let colorBtn = document.querySelectorAll(".filter_color");
let mainContainer = document.querySelector(".main_container");
let body = document.body;
let plusButton = document.querySelector(".fa-plus");
let deleteState = false;
let crossButton = document.querySelector(".fa-times");
let uifn = new ShortUniqueId();


let taskArr = [];
if (localStorage.getItem("allTask")) {
    taskArr = JSON.parse(localStorage.getItem("allTask"));
    // UI
    for (let i = 0; i < taskArr.length; i++) {
        let {
            id,
            color,
            task
        } = taskArr[i];
        createTask(color, task, false, id);
    }
}


for (let i = 0; i < colorBtn.length; i++) {
    colorBtn[i].addEventListener("click", function (e) {
        let color = colorBtn[i].classList[1];
        mainContainer.style.backgroundColor = color;
    })
}

plusButton.addEventListener("click", createModal);
crossButton.addEventListener("click", setDeleteState);


function createModal() {
    let modalcontainer = document.querySelector(".modal_container");
    if (modalcontainer == null) {
        let modalcontainer = document.createElement("div");
        modalcontainer.setAttribute("class", "modal_container");
        modalcontainer.innerHTML = `<div class="input_container">
        <textarea class="modal_input" 
        placeholder="Enter Your text"></textarea>
    </div>
    <div class="modal_filter_container">
        <div class="filter pink"></div>
        <div class="filter blue"></div>
        <div class="filter green"></div>
        <div class="filter black"></div>
    </div>`;
        body.appendChild(modalcontainer);
        handleModal(modalcontainer);
    }
    let textArea = modalcontainer.querySelector(".modal_input");
    textArea.value = "";


}

function handleModal(modal_container) {
    let cColor = "black";
    let modalFilters = document.querySelectorAll(".modal_filter_container .filter");
    modalFilters[3].classList.add("border");
    for (let i = 0; i < modalFilters.length; i++) {
        modalFilters[i].addEventListener("click", function () {
            modalFilters.forEach((filter) => {
                filter.classList.remove("border");
            })
            modalFilters[i].classList.add("border")
            cColor = modalFilters[i].classList[1];
            console.log("current color of task", cColor);

        })
    }
    let textArea = document.querySelector(".modal_input");
    textArea.addEventListener("keydown", function (e) {
        if (e.key == "Enter" && textArea.value != "") {
            console.log("Task ", textArea.value, "color ", cColor);
            modal_container.remove();
            createTask(cColor, textArea.value, true);
        }
    })
}

function createTask(color, task, flag, id) {
    let taskContainer = document.createElement("div");
    taskContainer.setAttribute("class", "task_container");
    let uid = id || uifn();
    taskContainer.innerHTML = `<div class="task_filter ${color}"></div>
    <div class="task_desc_container">
        <h3 class="uid">#${uid}</h3>
        <div class="task_desc" contentEditable="true">${task}</div>
    </div>
</div >`;
    mainContainer.appendChild(taskContainer);
    let taskFilter = taskContainer.querySelector(".task_filter");
    if (flag == true) {
        // console.log(uid);
        let obj = {
            "task": task,
            "id": `${uid}`,
            "color": color
        };
        taskArr.push(obj);
        let finalArr = JSON.stringify(taskArr);
        localStorage.setItem("allTask", finalArr);
    }
    taskFilter.addEventListener("click", () => {
        let colors = ["pink", "green", "blue", "black"];
        let currentColor = taskFilter.classList[1];
        let idx = colors.indexOf(currentColor);
        let newColorIdx = (idx + 1) % 4;
        taskFilter.classList.remove(currentColor);
        taskFilter.classList.add(colors[newColorIdx]);
    })
    taskContainer.addEventListener("click", deleteTask);
    let taskDesc = taskContainer.querySelector(".task_desc");
    taskDesc.addEventListener("keypress", editTask);
}

function deleteTask(e) {
    let taskContainer = e.currentTarget;
    if (deleteState == true) {
        // taskContainer.remove();
        let uidElem = taskContainer.querySelector(".uid");
        let uid = uidElem.innerText.split("#")[1];
        for (let i = 0; i < taskArr.length; i++) {
            let {
                id
            } = taskArr[i];
            console.log(id, uid);
            if (id == uid) {
                taskArr.splice(i, 1);
                let finalTaskArr = JSON.stringify(taskArr);
                localStorage.setItem("allTask", finalTaskArr);
                taskContainer.remove();
                break;
            }
        }
    }
}

function editTask(e) {
    let taskDesc = e.currentTarget;
    let uidElem = taskDesc.parentNode.children[0];
    let uid = uidElem.innerText.split("#")[1];
    for (let i = 0; i < taskArr.length; i++) {
        let {
            id
        } = taskArr[i];
        console.log(id, uid);
        if (id == uid) {
            taskArr[i].task = taskDesc.innerText
            let finalTaskArr = JSON.stringify(taskArr);
            localStorage.setItem("allTask", finalTaskArr);

            break;
        }
    }
}

function setDeleteState(e) {

    let crossButton = e.currentTarget;
    let parent = crossButton.parentNode;
    if (deleteState == false) {
        parent.classList.add("active");
    } else {
        parent.classList.remove("active");
    }
    deleteState = !deleteState;

}