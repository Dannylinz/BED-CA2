//Naing Lin Htet DISM/2B/21 P2329606
document.addEventListener("DOMContentLoaded", function () {
    
    const userId = localStorage.getItem("user_id"); // Assuming the user ID is stored in localStorage
    const token = localStorage.getItem("token"); // Get the token

    // Function to fetch and display tasks
    const fetchTasks = () => {
        const callback = (responseStatus, responseData) => {
            console.log("responseStatus:", responseStatus);
            console.log("responseData:", responseData);

            const msgList = document.getElementById("taskList");
            msgList.innerHTML = ''; // Clear the list before adding new items
            
            responseData.forEach((task) => {
                const displayItem = document.createElement("div");
                displayItem.className = "col-xl-3 col-lg-4 col-md-6 col-sm-12 p-4";
                
                // Check if the user is logged in to decide whether to show complete task options
                const taskOptions = token ? `
                    <button onclick="completeTask(${task.task_id})" class="btn btn-success btn-hover-light">Complete Task</button>
                    <textarea id="notes-${task.task_id}" placeholder="Add notes here..." rows="3" class="form-control mt-2"></textarea>
                ` : '';

                displayItem.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${task.title}</h5>
                            <p class="card-text">
                                Number: ${task.task_id} <br>
                                Description: ${task.description} <br>
                                Points: ${task.points}
                            </p>
                            ${task.user_id == userId ? `
                                <a href="updatetasks.html?task_id=${task.task_id}" class="btn btn-warning btn-hover-light">Update Task</a>
                                <button onclick="deleteTask(${task.task_id})" class="btn btn-danger btn-hover-light1">Delete Task</button>
                            ` : taskOptions}
                        </div>
                    </div>`;
                msgList.appendChild(displayItem);
            });
        };

        fetchMethod(currentUrl + "/api/task", callback, 'GET', null, token);
    };

    fetchTasks(); // Fetch and display tasks on page load


});

// Function to complete a task
function completeTask(taskId) {
    const notes = document.getElementById(`notes-${taskId}`).value;

    const data = {
        task_id: taskId,
        notes: notes
    };

    const callback = (responseStatus, responseData) => {
        console.log("status: ", responseStatus);
        console.log("data: ", responseData);

        if (responseStatus === 201) {
            window.location.href = "yourtasks.html"; // Redirect to the page showing completed tasks
        } else {
            alert(responseData.message);
        }
    };

    fetchMethod(currentUrl + `/api/task/complete/${taskId}`, callback, 'POST', data, localStorage.getItem("token"));
}
