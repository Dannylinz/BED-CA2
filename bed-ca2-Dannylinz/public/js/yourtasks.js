//Naing Lin Htet DISM/2B/21 P2329606

const callback = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);

    if (responseStatus == 401) {
        localStorage.removeItem("token");
        window.location.href = "login.html";
    }
    
    const messageList = document.getElementById("taskProgressList");
    
    // Clear existing content
    messageList.innerHTML = '';

    responseData.forEach((msg) => {
        const displayItem = document.createElement("div");
        displayItem.className = "col-xl-3 col-lg-3 col-md-4 col-sm-6 col-xs-12 p-3";
        displayItem.innerHTML = `
              <div class="card">
                  <div class="card-body">
                      <p class="card-text">
                          <strong>Task ID:</strong> ${msg.task_id} <br>
                          <strong>Completion Date:</strong> ${new Date(msg.completion_date).toLocaleDateString()} <br>
                          <strong>Notes:</strong> ${msg.notes ? msg.notes : "No notes provided"} <br>
                      </p>
                  </div>
              </div>
        `;
        messageList.appendChild(displayItem);
    });
};

fetchMethod(
    currentUrl + "/api/taskprogress/user",
    callback,
    "GET",
    null,
    localStorage.getItem("token")
);
