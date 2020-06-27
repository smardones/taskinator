var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var taskIDCounter = 0;
var pageContentEl = document.querySelector("#page-content");

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

    var isEdit = formEl.hasAttribute("data-task-id");
    
    if (isEdit) {
        var taskID = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskID);
    }
    else {
    // package the date up as an object
    var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput
    }

    createTaskEl(taskDataObj);
    };


    formEl.reset();
}

var completeEditTask = function(taskName, taskType, taskID) {
    //find the matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskID + "']");

    // set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    alert("Task Updated!");

    // Reset form by removing task ID and changing button back to normal
    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";

}

var createTaskEl = function(taskDataObj) {
    // Creat List Item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
    listItemEl.setAttribute("draggable", "true");

    // Creat div to hold task info and add to list item
    taskInfoEl = document.createElement("div");
    // Give it a class name
    taskInfoEl.className = "task-info";
    
    // add task id as a custom attribute
    listItemEl.setAttribute("data-task-id", taskIDCounter);
    
    // Add HTML content to the div
    taskInfoEl.innerHTML = "<h3 class ='task-name'>" + taskDataObj.name + "<h3><span class='task-type'>" + taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);
    var taskActionsEl = createTaskActions(taskIDCounter);
    listItemEl.appendChild(taskActionsEl);
    tasksToDoEl.appendChild(listItemEl);
    taskIDCounter++;
}

var createTaskActions = function(taskID) {
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskID);

    actionContainerEl.appendChild(editButtonEl);

    //create Delete Button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskID);

    actionContainerEl.appendChild(deleteButtonEl);

    //Create drop down status menu
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskID);
    var statusChoices = ["To Do", "In Progress", "Completed"];
    for (var i = 0; i < statusChoices.length; i++) {
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        statusSelectEl.appendChild(statusOptionEl);
    }

    actionContainerEl.appendChild(statusSelectEl);

    return actionContainerEl;
}
formEl.addEventListener("submit", taskFormHandler);



var taskButtonHandler = function(event) {
    

    var targetEl = event.target;

    if (targetEl.matches(".delete-btn")) {
        var taskID = event.target.getAttribute("data-task-id");
        deleteTask(taskID);
    }

    else if (targetEl.matches(".edit-btn")) {
        var taskID = event.target.getAttribute("data-task-id");
        editTask(taskID);
    }
}
pageContentEl.addEventListener("click", taskButtonHandler);

var deleteTask = function(taskID) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskID + "']");
    taskSelected.remove();
}

var editTask = function(taskID) {

    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskID + "']");

    var taskName = taskSelected.querySelector("h3.task-name").textContent;

    var taskType = taskSelected.querySelector("span.task-type").textContent;

    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    document.querySelector("#save-task").textContent = "Save Task";
    formEl.setAttribute("data-task-id", taskID);
}

var taskStatusChangeHandler = function(event) {
    
    // get the task item's id
    var taskID = event.target.getAttribute("data-task-id");

    // get teh currently selected option's value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();
    console.log(statusValue);

    // find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskID + "']");

    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    }
    else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
    }
    else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
    }
};

var dragTaskHandler = function(event) {
    var taskId = event.target.getAttribute("data-task-id");
    event.dataTransfer.setData("text/plain", taskId);
    var getId = event.dataTransfer.getData("text/plain");
    console.log("getId:", getId, typeof getId);
};

var dropZoneDragHandler = function(event) {
    var taskListEl = event.target.closest(".task-list");
    if (taskListEl) {
    event.preventDefault();
    taskListEl.setAttribute("style", "background: rgba(68, 233, 255, 0.7); border-style: dashed");
    }
}

var dropTaskHandler = function(event) {
    var id = event.dataTransfer.getData("text/plain");
    var draggableElement = document.querySelector("[data-task-id='" + id + "']");
    var dropZoneEl = event.target.closest(".task-list");
    var statusType = dropZoneEl.id;
    var statusSelectEl = draggableElement.querySelector("select[name='status-change']");
    
    if (statusType = "tasks-to-do") statusSelectEl.selectedIndex = 0;
    else if (statusType = "tasks-in-progress") statusSelectEl.selectedIndex = 1;
    else if (statusType = "tasks-completed") statusSelectEl.selectedIndex = 2;
    
    dropZoneEl.appendChild(draggableElement);
    dropZoneEl.removeAttribute("style");
};

var dragLeaveHandler = function(event) {
    var taskListEl = event.target.closest(".task-list");
    if (taskListEl) {
        taskListEl.removeAttribute("style");
    }
}

pageContentEl.addEventListener("change", taskStatusChangeHandler);
pageContentEl.addEventListener("dragstart", dragTaskHandler);
pageContentEl.addEventListener("dragover", dropZoneDragHandler);
pageContentEl.addEventListener("drop", dropTaskHandler);
pageContentEl.addEventListener("dragleave", dragLeaveHandler);

