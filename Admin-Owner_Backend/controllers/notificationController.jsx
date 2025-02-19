const db = require("../config/db");

// Fetch active notifications
exports.getActiveNotifications = (req, res) => {
    db.query("SELECT * FROM Notifications WHERE status = 1", (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
};

// Auto-update expired notifications (CRON job runs this)
exports.expireNotifications = () => {
    const now = new Date();
    db.query("UPDATE Notifications SET status = 0 WHERE expires_at <= ? AND status = 1", [now], (err) => {
        if (err) {
            console.error("Error updating expired notifications:", err);
        } else {
            console.log("Expired notifications updated");
        }
    });
};
