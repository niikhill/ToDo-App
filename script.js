let colorBtn = document.querySelectorAll(".filter_color");
let mainContainer = document.querySelector(".main_container");
let body = document.body;
let plusButton = document.querySelector(".fa-plus");
let deleteState = false;
let crossButton = document.querySelector(".fa-times");
let uifn = new ShortUniqueId();


//Tool Tip Text
tippy('#filter-container', {
    content: "Click on color to filter the tasks",
    theme: 'light'
  });


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
        let taskContainer = document.querySelectorAll(".task_container")
        taskContainer.forEach(item =>{
            if(item.children[0].classList[1]==color){
                item.style.display = "block";
            }else{
                item.style.display = "none";
            }
        })
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
    taskFilter.addEventListener("click", changeColor)
    taskContainer.addEventListener("click", deleteTask);
    let taskDesc = taskContainer.querySelector(".task_desc");
    taskDesc.addEventListener("keypress", editTask);
}

function changeColor(e) {
    let taskFilter = e.currentTarget;
    let taskContainer = taskFilter.parentNode;
    let colors = ["pink", "blue", "green", "black"];
    let cColor = taskFilter.classList[1];
    let idx = colors.indexOf(cColor);
    let newColorIdx = (idx + 1) % 4;
    taskFilter.classList.remove(cColor);
    taskFilter.classList.add(colors[newColorIdx]);
    let taskDesc = taskContainer.querySelector(".task_desc");
    let uidElem = taskDesc.parentNode.children[0];
    let uid = uidElem.innerText.split("#")[1];
    for (let i = 0; i < taskArr.length; i++) {
        let {
            id
        } = taskArr[i];
        console.log(id, uid);
        if (id == uid) {
            taskArr[i].color = taskFilter.classList[1];
            let finalTaskArr = JSON.stringify(taskArr);
            localStorage.setItem("allTask", finalTaskArr);

            break;
        }
    }

}

function deleteTask(e) {
    let taskContainer = e.currentTarget;
    let uidElem = taskContainer.querySelector(".uid");
    let uid = uidElem.innerText.split("#")[1];
    if (deleteState == true) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire(
                'Deleted!',
                `Task with ID ${uid} was successfully deleted`,
                'success'
            )
            
            if (deleteState == true) {
                // taskContainer.remove();
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
    })
}
}

// function deleteTask(e) {
//     let taskContainer = e.currentTarget;
//     if (deleteState == true) {
//         // taskContainer.remove();
//         let uidElem = taskContainer.querySelector(".uid");
//         let uid = uidElem.innerText.split("#")[1];
//         for (let i = 0; i < taskArr.length; i++) {
//             let {
//                 id
//             } = taskArr[i];
//             console.log(id, uid);
//             if (id == uid) {
//                 taskArr.splice(i, 1);
//                 let finalTaskArr = JSON.stringify(taskArr);
//                 localStorage.setItem("allTask", finalTaskArr);
//                 taskContainer.remove();
//                 break;
//             }
//         }
//     }
// }

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
        Swal.fire({
            title: 'Delete State On',
            text: "Click on Task to delete it",
            showClass: {
              popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
            }
          })
    } else {
        parent.classList.remove("active");
        Swal.fire({
            title: 'Delete State Off',
            text: "Click on X icon to turn it back on",
            showClass: {
              popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
            }
          })
    }
    deleteState = !deleteState;

}