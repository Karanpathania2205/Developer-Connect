const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

const User = require('../../models/User')

//@route    POST api/users
//@desc     Register User
//@access   Public

router.post('/', [
    body('name', 'Name id required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Please enter a password with 6 or more character').isLength({ min: 6 })
]

    ,
    async (req, res) => {
        //whatever data is sent or written can be accessed by req.body
        //console.log(req.body);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;
        try {
            //See if user exists , if so then send back an error

            let user = await User.findOne({ email });//{email:email}
            if (user) {
                return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
            }
            // Get users gravatar 
            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            })

            user = new User({
                name,
                email,
                avatar,
                password
            })
            //Encrypt password using bycrypt
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();//saves the user in db
            //Return Json Web Token 

            res.send('User registered')
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }



    });

module.exports = router;