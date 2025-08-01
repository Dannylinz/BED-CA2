//Naing Lin Htet DISM/2B/21 P2329606

// Function to group items by their levels
function groupItemsByLevel(items) {
    return items.reduce((acc, item) => {
        if (!acc[item.level]) {
            acc[item.level] = [];
        }
        acc[item.level].push(item);
        return acc;
    }, {});
}

// Function to fetch user level
function fetchUserLevel(user_id, callback) {
    fetchMethod(`${currentUrl}/api/users/${user_id}`, (responseStatus, responseData) => {
        if (responseStatus === 200) {
            callback(null, responseData.level);
        } else {
            callback(new Error('Failed to fetch user level'));
        }
    }, "GET", null, localStorage.getItem("token"));
}

// Callback function to handle response
const callback = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);

    if (responseStatus === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        window.location.href = "login.html";
    } else if (responseStatus === 200) {
        const itemList = document.getElementById("itemList");
        itemList.innerHTML = ''; // Clear existing items

        const itemsByLevel = groupItemsByLevel(responseData);

        const user_id = localStorage.getItem("user_id");

        if (user_id) {
            fetchUserLevel(user_id, (err, userLevel) => {
                if (err) {
                    console.error(err.message);
                    alert("Error fetching user level.");
                    return;
                }

                for (const level in itemsByLevel) {
                    const levelHeader = document.createElement('h4');
                    levelHeader.textContent = `Level ${level} Items`;
                    itemList.appendChild(levelHeader);

                    const itemsRow = document.createElement('div');
                    itemsRow.className = 'row';
// Check if the user level is sufficient to purchase the item
                    itemsByLevel[level].forEach((item) => {
                        const displayItem = document.createElement("div");
                        displayItem.className = "col-xl-3 col-lg-4 col-md-6 col-sm-12 p-4";
                        displayItem.innerHTML = `
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title">${item.item_name}</h5>
                                    <p class="card-text">
                                        Type: ${item.item_type} <br>
                                        Description: ${item.item_description} <br>
                                        Price: ${item.price} <br>
                                        Level: ${item.level}
                                    </p>
                                    ${userLevel >= item.level ? `<a href="#" class="btn btn-primary" id="buy-${item.item_id}">Buy</a>` : ''}
                                </div>
                            </div>
                        `;
                        itemsRow.appendChild(displayItem);

                        const buyButton = displayItem.querySelector(`#buy-${item.item_id}`);
                        if (buyButton) {
                            buyButton.addEventListener("click", (event) => {
                                event.preventDefault();

                                if (!user_id) {
                                    alert("You must be logged in to purchase items.");
                                    return;
                                }

                                if (userLevel >= item.level) {
                                    const purchaseCallback = (responseStatus, responseData) => {
                                        console.log("responseStatus:", responseStatus);
                                        console.log("responseData:", responseData);

                                        if (responseStatus === 200) {
                                            alert("Item purchased successfully!");
                                        } else {
                                            alert("Error purchasing item: " + (responseData.message || "Unknown error"));
                                        }
                                    };

                                    const purchaseData = {
                                        user_id: user_id,
                                        item_id: item.item_id
                                    };

                                    fetchMethod(currentUrl + "/api/purchase", purchaseCallback, "POST", purchaseData, localStorage.getItem("token"));
                                } else {
                                    alert("Your level is not high enough to purchase this item.");
                                }
                            });
                        }
                    });

                    itemList.appendChild(itemsRow);
                }
            });
        } else {
            for (const level in itemsByLevel) {
                const levelHeader = document.createElement('h4');
                levelHeader.textContent = `Level ${level} Items`;
                itemList.appendChild(levelHeader);

                const itemsRow = document.createElement('div');
                itemsRow.className = 'row';

                itemsByLevel[level].forEach((item) => {
                    const displayItem = document.createElement("div");
                    displayItem.className = "col-xl-3 col-lg-4 col-md-6 col-sm-12 p-4";
                    displayItem.innerHTML = `
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">${item.item_name}</h5>
                                <p class="card-text">
                                    Type: ${item.item_type} <br>
                                    Description: ${item.item_description} <br>
                                    Price: ${item.price} <br>
                                    Level: ${item.level}
                                </p>
                            </div>
                        </div>
                    `;
                    itemsRow.appendChild(displayItem);
                });

                itemList.appendChild(itemsRow);
            }
        }
    } else {
        console.error("Unhandled response status:", responseStatus);
    }
};

// Fetch all items on page load
fetchMethod(currentUrl + "/api/items", callback, "GET", null, localStorage.getItem("token"));
