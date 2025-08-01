document.addEventListener("DOMContentLoaded", function () {
    const userId = localStorage.getItem("user_id");
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
        window.location.href = "login.html";
        return;
    }

    const messageList = document.getElementById("messageList");
    const messageForm = document.getElementById("messageForm");
    const messageInput = document.getElementById("messageInput");
    const editModal = new bootstrap.Modal(document.getElementById('editModal'));
    const editMessageInput = document.getElementById("editMessageInput");
    const saveEditBtn = document.getElementById("saveEditBtn");

    let currentEditingMessageId = null;

    const fetchMessages = () => {
        fetch(`${currentUrl}/api/messages`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(messages => {
            if (!Array.isArray(messages)) {
                console.error('Expected an array but got:', messages);
                return;
            }
            displayMessages(messages);
        })
        .catch(error => console.error("Error fetching messages:", error));
    };

    const displayMessages = (messages) => {
        messageList.innerHTML = "";
        messages.forEach(message => {
            const messageDiv = document.createElement("div");
            messageDiv.classList.add("message-card", message.user_id === userId ? "message-user" : "message-other");

            const messageContent = `
                <div class="message-item ${message.user_id === userId ? "" : "other"}">
                    <strong>${message.username}</strong>
                    <p>${message.message_text}</p>
                    <small>${new Date(message.created_at).toLocaleTimeString()}</small>
                    ${message.user_id === userId ? `
                        <button class="btn btn-secondary edit-button" data-message-id="${message.id}">Edit</button>
                        <button class="btn btn-danger delete-button" data-message-id="${message.id}">Delete</button>
                    ` : ""}
                </div>
            `;

            messageDiv.innerHTML = messageContent;
            messageList.appendChild(messageDiv);
        });

        // Attach event listeners to edit and delete buttons
        document.querySelectorAll(".edit-button").forEach(button => {
            button.addEventListener("click", function () {
                currentEditingMessageId = this.dataset.messageId;
                const messageContent = this.previousElementSibling.previousElementSibling.textContent;
                editMessageInput.value = messageContent;
                editMessageInput.dataset.messageId = currentEditingMessageId; // Store message ID in textarea
                editModal.show();
            });
        });

        document.querySelectorAll(".delete-button").forEach(button => {
            button.addEventListener("click", function () {
                const messageId = this.dataset.messageId;
                if (confirm("Are you sure you want to delete this message?")) {
                    deleteMessage(messageId);
                }
            });
        });
    };

    messageForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const messageText = messageInput.value.trim();

        if (!messageText) {
            console.error("Message cannot be empty");
            return;
        }

        const messageData = {
            user_id: userId,
            username: username,
            message_text: messageText
        };

        fetch(`${currentUrl}/api/messages`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(messageData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            fetchMessages(); // Refresh messages list
            messageForm.reset(); // Clear form fields
        })
        .catch(error => console.error("Error sending message:", error));
    });

    saveEditBtn.addEventListener("click", () => {
        const updatedContent = editMessageInput.value.trim();
        const messageId = editMessageInput.dataset.messageId;

        if (!updatedContent) {
            console.error("Updated message cannot be empty");
            return;
        }

        console.log(`Updating message ID ${messageId} with content: ${updatedContent}`);

        fetch(`${currentUrl}/api/messages/${messageId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ message_text: updatedContent })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Message updated successfully");
            editModal.hide();
            fetchMessages(); // Refresh messages list
        })
        .catch(error => console.error("Error updating message:", error));
    });

    const deleteMessage = (messageId) => {
        fetch(`${currentUrl}/api/messages/${messageId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Message deleted successfully");
            fetchMessages(); // Refresh messages list
        })
        .catch(error => console.error("Error deleting message:", error));
    };

    fetchMessages(); // Initial fetch of messages
});
