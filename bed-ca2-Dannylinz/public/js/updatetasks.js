//Naing Lin Htet DISM/2B/21 P2329606
// this one not using because i m not putting update/delete/put new tasks in there/ must connect with updatetask.html 
document.addEventListener("DOMContentLoaded", function () {
    const url = new URL(window.location.href);
    const urlParams = url.searchParams;
    const taskId = urlParams.get("task_id");
    const form = document.getElementById("updateTaskForm");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const callbackForUpdate = (responseStatus, responseData) => {
            console.log("responseStatus:", responseStatus);
            console.log("responseData:", responseData);

            if (responseStatus === 200) {
                window.location.href = "task.html";
            } else {
                alert(responseData.message);
            }
        };

        const taskTitle = document.getElementById("updateTitle").value;
        const taskDescription = document.getElementById("updateDescription").value;
        const taskPoints = document.getElementById("updatePoints").value;

        const data = {
            title: taskTitle,
            description: taskDescription,
            points: taskPoints
        };
        fetchMethod(currentUrl + `/api/task/${taskId}`, callbackForUpdate, "PUT", data);
    });
});
