//Naing Lin Htet DISM/2B/21 P2329606

document.addEventListener("DOMContentLoaded", function () {
    const userId = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");
  
    if (!userId || !token) {
      window.location.href = "login.html";
      return;
    }
  
    const callback = (responseStatus, responseData) => {
      if (responseStatus == 200) {
        displayUserInfo(responseData);
      } else {
        console.error("Failed to fetch user data:", responseData.message);
      }
    };
  
    const fetchUserData = (user_id, token, callback) => {
      fetchMethod(currentUrl + `/api/users/${user_id}`, callback, "GET", null, token);
    };
  
    const displayUserInfo = (userInfo) => {
      document.getElementById("username").innerText = userInfo.username;
      document.getElementById("user_id").innerText = userInfo.user_id;
      document.getElementById("email").innerText = userInfo.email;
      document.getElementById("created_on").innerText = new Date(userInfo.created_on).toLocaleDateString();
      document.getElementById("points").innerText = userInfo.points;
      document.getElementById("price").innerText = userInfo.price;
      document.getElementById("level").innerText = userInfo.level;
  
      const pointsToNextLevel = Math.pow(2, userInfo.level - 1) * 200;
      if (userInfo.points >= pointsToNextLevel) {
        document.getElementById("levelUpContainer").classList.remove("d-none");
        document.getElementById("pointsToNextLevel").innerText = `Points to next level: ${pointsToNextLevel}`;
      }
    };
  
    fetchUserData(userId, token, callback);
  
    document.getElementById("levelUpButton").addEventListener("click", function () {
      fetch(`/api/users/${userId}/level-up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Level up successful") {
          alert("Level up successful!");
          location.reload();
        } else {
          alert("Error leveling up: " + data.message);
        }
      })
      .catch((error) => {
        console.error("Error leveling up:", error);
      });
    });
  });