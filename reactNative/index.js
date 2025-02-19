import { registerRootComponent } from 'expo';

import App from './App';

registerRootComponent(App);
exports.deleteCartItem = async (req, res) => {
    try {
        const user_id = req.user?.id;  
        const { item_id } = req.params;

        if (!user_id || !item_id) {
            return res.status(400).json({ message: "Missing user_id or item_id" });
        }

        console.log("Deleting item:", { user_id, item_id });

        const query = "DELETE FROM Cart WHERE user_id = ? AND item_id = ?";
        console.log("Executing SQL Query:", query, [user_id, item_id]);

        const [result] = await db.execute(query, [user_id, item_id]);

        console.log("SQL Query Result:", result);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Cart item not found" });
        }

        return res.status(200).json({ message: "Item deleted successfully" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
