// dont need this since i m not creating a create task form

document.addEventListener("DOMContentLoaded", function () {
    const createTaskForm = document.getElementById("createTaskForm");

    if (!createTaskForm) {
        console.error("Form with ID 'createTaskForm' not found.");
        return;
    }

    const callback = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);
        if (responseStatus == 201) {
            createTaskForm.reset();
            window.location.href = "yourtasks.html";
        } else {
            alert(responseData.message);
        }
    };

    createTaskForm.addEventListener("submit", function (event) {
        console.log("createTaskForm.addEventListener");
        event.preventDefault();

        const taskId = document.getElementById("createtaskp").value;
        const notes = document.getElementById("createtask").value;

        const data = {
            task_id: taskId,
            notes: notes,
        };

        // Perform fetch request to complete the task
        fetchMethod(
            currentUrl + "/api/taskprogress",
            callback,
            "POST",
            data,
            localStorage.getItem("token")
        );
    });
});
