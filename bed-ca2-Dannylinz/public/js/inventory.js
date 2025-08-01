document.addEventListener('DOMContentLoaded', function() {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
        console.error("User ID not found in localStorage.");
        return;
    }

    fetch(`/api/users/${userId}/inventory`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const inventoryList = document.getElementById('inventoryList');
            if (!inventoryList) {
                console.error("Inventory list container not found");
                return;
            }
            inventoryList.innerHTML = ''; // Clear existing items

            if (data.length === 0) {
                inventoryList.innerHTML = '<p>No items found in inventory.</p>';
                return;
            }

            data.forEach(item => {
                const card = document.createElement('div');
                card.className = 'col-md-4 mb-4';
                card.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${item.item_name}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">Type: ${item.item_type}</h6>
                            <p class="card-text">Description: ${item.item_description}</p>
                            <p class="card-text">Price: ${item.price}</p>
                            <p class="card-text">Purchased on: ${new Date(item.purchase_date).toLocaleDateString()}</p>
                        </div>
                    </div>
                `;
                inventoryList.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error fetching inventory:', error);
        });
});
