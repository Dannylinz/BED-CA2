//Naing Lin Htet 2329606 DISM/FT/2B/21
const model = require('../models/itemModel.js');

module.exports.insertItem = (req, res, next) => {
    const data = {
        item_name: req.body.item_name,
        item_type: req.body.item_type,
        item_description: req.body.item_description,
        price: req.body.price,
        level: req.body.level
    };

    if (!data.item_name || !data.item_type || !data.price || !data.level) {
        res.status(400).send("Error: Missing required fields (item_name, item_type, price or level)");
        return;
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error inserting item:", error);
            res.status(500).json(error);
        } else {
            res.status(201).json({
                item_id: results.insertId,
                item_name: data.item_name,
                item_type: data.item_type,
                item_description: data.item_description,
                price: data.price,
                level: data.level
            });
        }
    };

    model.insertItem(data, callback);
};

module.exports.getAllItems = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error fetching items:", error);
            res.status(500).json(error);
        } else {
            res.status(200).json(results);
        }
    };

    model.getAllItems(callback);
};

module.exports.purchaseItem = (req, res, next) => {
    const data = {
        user_id: req.body.user_id,
        item_id: req.body.item_id
    };

    if (!data.user_id || !data.item_id) {
        res.status(400).send("Error: Missing required fields (user_id or item_id)");
        return;
    }

    console.log(`User ID: ${data.user_id}, Item ID: ${data.item_id}`);

    // Get user level
    model.getUserLevel(data.user_id, (error, userResults) => {
        if (error) {
            console.error("Error fetching user level:", error);
            res.status(500).json(error);
            return;
        }
        if (userResults.length === 0) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const userLevel = userResults[0].level;
        console.log(`User Level: ${userLevel}`);

        // Get item level
        model.getItemById(data.item_id, (error, itemResults) => {
            if (error) {
                console.error("Error fetching item:", error);
                res.status(500).json(error);
                return;
            }
            if (itemResults.length === 0) {
                res.status(404).json({ message: "Item not found" });
                return;
            }

            const item = itemResults[0];
            const itemLevel = item.level;
            console.log(`Item Level: ${itemLevel}, Item Price: ${item.price}`);

            // Check if user level matches item level
            if (userLevel < itemLevel) {
                res.status(403).json({ message: `You need to be at least level ${itemLevel} to purchase this item.` });
                return;
            }

            // Check user balance
            model.getUserBalance(data.user_id, (error, userBalanceResults) => {
                if (error) {
                    console.error("Error fetching user balance:", error);
                    res.status(500).json(error);
                    return;
                }
                if (userBalanceResults.length === 0) {
                    res.status(404).json({ message: "User not found" });
                    return;
                }

                const user = userBalanceResults[0];
                console.log(`User Balance: ${user.price}`);

                if (user.price < item.price) {
                    res.status(400).json({ message: "Insufficient funds" });
                    return;
                }

                // Proceed with purchase
                model.recordPurchase(data.user_id, data.item_id, item.price, (error) => {
                    if (error) {
                        console.error("Error recording purchase:", error);
                        res.status(500).json(error);
                        return;
                    }

                    // Update user balance
                    model.updateUserBalance(data.user_id, item.price, (error) => {
                        if (error) {
                            console.error("Error updating user balance:", error);
                            res.status(500).json(error);
                            return;
                        }

                        res.status(200).json({ message: "Item purchased successfully" });
                    });
                });
            });
        });
    });
};