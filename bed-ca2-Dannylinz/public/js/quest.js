//Naing Lin Htet DISM/2B/21 P2329606
document.addEventListener("DOMContentLoaded", function () {
    const userId = localStorage.getItem("user_id");
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      window.location.href = "login.html";
      return;
    }

    const questForm = document.getElementById("questForm");
    const questsList = document.getElementById("questsList");

    if (!questForm) {
      console.error("Quest form not found");
      return;
    }

    if (!questsList) {
      console.error("Quests list container not found");
      return;
    }

    // Fetch all quests
    const fetchAllQuests = () => {
      fetchMethod(`${currentUrl}/api/quests`, (status, data) => {
        if (status === 200) {
          displayQuests(data);
        } else {
          console.error("Failed to fetch quests:", data.message);
        }
      }, "GET", null, token);
    };

    // Display quests
    const displayQuests = (quests) => {
      questsList.innerHTML = "";
      quests.forEach((quest) => {
        const questCard = document.createElement("div");
        questCard.classList.add("list-group-item", "list-group-item-action");
        questCard.innerHTML = `
          <h6>${quest.quest_name}</h6>
          <p>${quest.quest_description}</p>
          <p><strong>Level Required:</strong> ${quest.level}</p>
          <p><strong>Reward Points:</strong> ${quest.price}</p>
          <p><strong>Created by:</strong> ${quest.created_by_username}</p>
          <p><strong>Status:</strong> ${quest.status}</p>
          ${quest.status === 'completed' ? `<p><strong>Completed by:</strong> ${quest.completed_by_username}</p>` : ''}
          ${quest.created_by_username !== username && quest.status === 'available' ? `<button class="btn btn-primary complete-quest" data-quest-id="${quest.quest_id}">Complete Quest</button>` : ''}
        `;
        questsList.appendChild(questCard);
      });

      // Attach event listeners to complete quest buttons
      document.querySelectorAll(".complete-quest").forEach(button => {
        button.addEventListener("click", function () {
          completeQuest(this.dataset.questId);
        });
      });
    };

    // Create a new quest
    questForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const questData = {
        quest_name: document.getElementById("quest_name").value,
        quest_description: document.getElementById("quest_description").value,
        level: document.getElementById("level").value,
        price: document.getElementById("price").value,
        username: username // Pass the username of the creator
      };

      fetchMethod(`${currentUrl}/api/quests`, (status, data) => {
        if (status === 201) {
          fetchAllQuests(); // Refresh quests list
          questForm.reset(); // Clear form fields
        } else {
          console.error("Failed to create quest:", data.message);
        }
      }, "POST", questData, token);
    });

    // Complete a quest
    const completeQuest = (questId) => {
      fetchMethod(`${currentUrl}/api/quests/${questId}/complete`, (status, data) => {
        if (status === 200) {
          alert("Quest completed successfully!");
          fetchAllQuests(); // Refresh quests list
        } else {
          alert(`Error: ${data.message}`); // Show error message to the user
          console.error("Failed to complete quest:", data.message);
        }
      }, "POST", { user_id: userId, username: username }, token); // Send user_id and username
    };

    fetchAllQuests();
});
