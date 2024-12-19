const pool = require('../db');

// Grant Messaging Permission
const grantPermission = async (req, res) => {
    const { user_id, can_message_id } = req.body;

    try {
        await pool.query(
            `INSERT INTO messaging_permissions (user_id, can_message_id) VALUES ($1, $2)
             ON CONFLICT DO NOTHING`,
            [user_id, can_message_id]
        );
        res.status(200).json({ message: 'Permission granted successfully' });
    } catch (error) {
        console.error('Error granting permission:', error);
        res.status(500).json({ error: 'Database error' });
    }
};

// Check Messaging Permission
const checkPermission = async (req, res) => {
    const { user_id, can_message_id } = req.query;

    try {
        const result = await pool.query(
            `SELECT * FROM messaging_permissions WHERE user_id = $1 AND can_message_id = $2`,
            [user_id, can_message_id]
        );
        if (result.rows.length > 0) {
            res.status(200).json({ permitted: true });
        } else {
            res.status(200).json({ permitted: false });
        }
    } catch (error) {
        console.error('Error checking permission:', error);
        res.status(500).json({ error: 'Database error' });
    }
};

// Revoke Messaging Permission
const revokePermission = async (req, res) => {
    const { user_id, can_message_id } = req.body;

    try {
        await pool.query(
            `DELETE FROM messaging_permissions WHERE user_id = $1 AND can_message_id = $2`,
            [user_id, can_message_id]
        );
        res.status(200).json({ message: 'Permission revoked successfully' });
    } catch (error) {
        console.error('Error revoking permission:', error);
        res.status(500).json({ error: 'Database error' });
    }
};

module.exports = {
    grantPermission,
    checkPermission,
    revokePermission
};
