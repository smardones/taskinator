var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");

function taskFormHandler(event) {
    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    console.dir(taskNameInput);
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    // check if input values are empty strings
    if (!taskNameInput || !taskTypeInput) {
        alert("Please fill out all fields of the form when adding a task.");
        return false;
    }
    // package the date up as an object
    var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput
    };

    createTaskEl(taskDataObj);

    formEl.reset();
}

var createTaskEl = function(taskDataObj) {
    // Creat List Item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    // Creat div to hold task info and add to list item
    taskInfoEl = document.createElement("div");
    // Give it a class name
    taskInfoEl.className = "task-info";
    // Add HTML content to the div
    taskInfoEl.innerHTML = "<h3 class ='task-name'>" + taskDataObj.name + "<h3><span class='task-type'>" + taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);
    tasksToDoEl.appendChild(listItemEl);
}
formEl.addEventListener("submit", taskFormHandler);