const User = require('../models/User');

const getUserById = async (req, res) => {
    try {
        // extract userId from the route params
        const userId = req.params.id;

        // fetch the user by Id
        const user = await User.findById(userId);

        // check if the user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // if user exists
        res.status(200).json(user);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { getUserById };