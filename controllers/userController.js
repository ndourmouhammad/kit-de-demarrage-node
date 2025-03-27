const User = require('../models/userModel');
const bcrypt = require('bcrypt');

const userRegister = async (req, res) => {
    try {

        const { name, email, mobile, password } = req.body;

        const isExist = await User.findOne({ email});

        if (isExist) {
            return res.status(400).send({
                error: 'Email already exist',
                success: false
            })
        }

        const hashPassword = await bcrypt.hash(password, 12);

        const user =  new User({
            name,
            email,
            mobile,
            password: hashPassword,
            image: 'images/'+req.file.filename,
        });

        const userData = await user.save();

        return res.status(200).json({
            status: 'success',
            message: 'User registered successfully',
            data: userData,
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        })
    }
}

module.exports = {
    userRegister
}