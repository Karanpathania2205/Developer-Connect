const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('config');
const { body, validationResult } = require('express-validator');

//@route    GET api/auth
//@desc     Test route
//@access   Public

router.get('/', auth, async (req, res) => {

    try {

        const user = await User.findById(req.user.id).select('-password');
        res.json(user);

    } catch (err) {
        cosnole.error(err.message);
        res.status(500).send("Server Error");
    }

});

//@route    POST api/auth
//@desc     Authenticate User and get token 
//@access   Public

router.post('/', [

    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Please is required')
        .exists()
]

    ,
    async (req, res) => {


        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        try {


            let user = await User.findOne({ email });//{email:email}
            if (!user) {
                return res.status(400)
                    .json({ errors: [{ msg: 'Invalid Credentials' }] });
            }

            //matching the users email and passsword
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400)
                    .json({ errors: [{ msg: 'Invalid Credentials' }] });
            }



            const payload = {
                user: {
                    id: user.id
                }
            }
            jwt.sign(payload,
                config.get('jwtSecret'),
                { expiresIn: 360000 },//to be changed in prodn.
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                })
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }



    });

module.exports = router;