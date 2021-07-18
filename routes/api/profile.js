const express = require('express');
const router = express.Router();
const config = require('config');
const request = require('request');

const auth = require('../../middleware/auth');
const { body, validationResult } = require('express-validator');
//validator is basicallu used to check whether the user has entered thos fielcan thds and if not we can throw an error accordingly

const Profile = require('../../models/Profile');
const User = require('../../models/User');
//@route    GET api/profile/me
//@desc     Get current users profile
//@access   Private
//this is to get my own profile , thus we need to pass the auth middleware for the jwt token
router.get('/me', auth, async (req, res) => {
    try {
        //we have the access to the req.user from the auth and we are assign this value to user , which is a field that we have created in Profile db .. of the type of users id 
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);
        //populate method basically helped us in accessing user db and we got the avatar and name of the user from there
        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for the user' });

        }
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }

});
//@route    GET api/profile
//@desc     Create or update a users profile]
//@access   Private
//included the two middlewares - auth and the validator 
router.post('/', [auth, [
    body('status', 'Status is requires').not().isEmpty(),
    body('skills', 'Skill is required').not().isEmpty()

]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin

    } = req.body;


    //Build profile object

    const profileFields = {};
    profileFields.user = req.user.id //req.user.id coming from the auth middleware
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {

        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }
    profileFields.social = {};
    if (youtube) profileFields.youtube = youtube;
    if (twitter) profileFields.twitter = twitter;
    if (facebook) profileFields.facebook = facebook;
    if (linkedin) profileFields.linkedin = linkedin;
    if (instagram) profileFields.instagram = instagram;

    try {
        let profile = await Profile.findOne({ user: req.user.id });
        if (profile) {
            //update
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true }
            );
            return res.json(profile);
        }

        //if not found then create the profile 
        profile = new Profile(profileFields);

        await profile.save();
        res.json(profile);

    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }





});
//@route    GET api/profile
//@desc     Get all the profiles
//@access   Public
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    GET api/profile/user/:user_id
// @desc     Get profile by user ID
// @access   Public
router.get(
    '/user/:user_id',

    async (req, res) => {
        try {
            const profile = await Profile.findOne({
                user: req.params.user_id
            }).populate('user', ['name', 'avatar']);

            if (!profile) return res.status(400).json({ msg: 'Profile not found' });

            return res.json(profile);
        } catch (err) {
            console.error(err.message);
            if (err.kind == 'ObjectId') {
                return res.status(400).json({ msg: 'Profile not found' });
            }
            return res.status(500).json({ msg: 'Server error' });
        }
    }
);


// @route    DELETE api/profile
// @desc     Delete profile, user & posts
// @access   Private
router.delete('/', auth, async (req, res) => {
    try {
        // Remove user posts



        // Remove profile
        await Profile.findOneAndRemove({ user: req.user.id }),//req.user.id accessed from the auth middleware

            // Remove user
            await User.findOneAndRemove({ _id: req.user.id });


        res.json({ msg: 'User deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route    PUT api/profile/experience
// @desc     Add profile experience
// @access   Private


// the profile model actually has an ecperience array inside the chema .. basically education is a seperate array which has objects inside it 
// so we are creating a seperate route for it .. if frontend we will create some sort of form for this .. so we need the auth
router.put(
    '/experience',
    [
        auth,
        [body('title', 'Title is required').not().isEmpty(),
        body('company', 'Company is required').not().isEmpty(),
        body('from', 'From date is required and needs to be from the past')
            .not().isEmpty()

        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description

        } = req.body;


        //created an object new exp which hold the data that user submits

        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        }
        try {
            const profile = await Profile.findOne({ user: req.user.id });

            profile.experience.unshift(newExp);

            //unshift is similar to push 

            await profile.save();

            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route    DELETE api/profile/experience/:exp_id
// @desc     Delete experience from profile
// @access   Private
//THis can actually be called as PUT request as well since something is getting updated 
router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        //get remove index
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

        profile.experience.splice(removeIndex, 1);


        await profile.save();
        res.json(profile);

    } catch (error) {
        console.error(err.message);
        return res.status(500).json({ msg: 'Server error' });
    }
});


// @route    PUT api/profile/education
// @desc     Add profile education
// @access   Private


// the profile model actually has an ecperience array inside the chema .. basically education is a seperate array which has objects inside it 
// so we are creating a seperate route for it .. if frontend we will create some sort of form for this .. so we need the auth
router.put(
    '/education',
    [
        auth,
        [body('school', 'Title is required').not().isEmpty(),
        body('degree', 'Company is required').not().isEmpty(),
        body('fieldofstudy', 'From date is required and needs to be from the past').not().isEmpty(),
        body('from', 'From date is required and needs to be from the past')
            .not().isEmpty()

        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description

        } = req.body;


        //created an object new exp which hold the data that user submits

        const newEdu = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        }
        try {
            const profile = await Profile.findOne({ user: req.user.id });

            profile.education.unshift(newEdu);

            //unshift is similar to push 

            await profile.save();

            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route    DELETE api/profile/education/:edu_id
// @desc     Delete education from profile
// @access   Private
//THis can actually be called as PUT request as well since something is getting updated 
router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        //get remove index
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);

        profile.education.splice(removeIndex, 1);


        await profile.save();
        res.json(profile);

    } catch (error) {
        console.error(err.message);
        return res.status(500).json({ msg: 'Server error' });
    }
});


// @route    GET api/profile/github/:username
// @desc     Get user repos from github
// @access   Public

router.get('/github/:username', async (req, res) => {
    try {
        const options = {

            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers: { 'user-agent': 'node.js' }


        };
        request(options, (error, response, body) => {
            if (error) console.error(error);

            if (response.statusCode != 200) {
                return res.status(404).json({ msg: 'No Github Profile Found' });
            }
            res.json(JSON.parse(body));
        })

    } catch (err) {
        console.error(err.message);
        return res.status(404).json({ msg: 'No Github profile found' });
    }
});
module.exports = router;