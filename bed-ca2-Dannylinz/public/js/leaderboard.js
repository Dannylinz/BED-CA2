//Naing Lin Htet DISM/2B/21 P2329606
document.addEventListener("DOMContentLoaded", function () {
    const leaderboardContainer = document.getElementById("leaderboard");

    if (!leaderboardContainer) {
        console.error("Leaderboard container not found");
        return;
    }

    const fetchLeaderboard = () => {
        fetch('/api/leaderboard', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data)) {
                displayLeaderboard(data);
            } else {
                console.error("Error fetching leaderboard:", data);
            }
        })
        .catch(error => {
            console.error("Error fetching leaderboard:", error);
        });
    };

    const displayLeaderboard = (users) => {
        leaderboardContainer.innerHTML = "";
        users.forEach(user => {
            const leaderboardItem = document.createElement("div");
            leaderboardItem.classList.add("list-group-item", "list-group-item-action");
            leaderboardItem.innerHTML = `
                <h5>${user.username}</h5>
                <p><strong>Points:</strong> ${user.points}</p>
                <p><strong>Coins:</strong> ${user.price}</p>
                <p><strong>Level:</strong> ${user.level}</p>
            `;
            leaderboardContainer.appendChild(leaderboardItem);
        });
    };

    fetchLeaderboard();
});
