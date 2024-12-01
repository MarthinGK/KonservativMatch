const { ManagementClient } = require('auth0');

const auth0 = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  scope: 'update:users',
});

const updateUserEmail = async (req, res) => {
  const { userId, email } = req.body;

  try {
    await auth0.updateUser({ id: userId }, { email });
    res.status(200).json({ message: 'Email updated successfully' });
  } catch (error) {
    console.error('Error updating email:', error);
    res.status(500).json({ error: 'Failed to update email' });
  }
};

module.exports = { updateUserEmail };