const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { body, validationResult } = require('express-validator');
const Post = require('../../models/Post');
const User = require('../../models/User');



//@route    POST api/posts
//@desc     create a post
//@access   Private
//private , because the user has to be logged in to create post

router.post('/', [auth, [
    body('text', 'Text is required').not().isEmpty()]], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //we need the user, its avatar ,name etc , which comes from users db so thats why called user model
        try {

            const user = await User.findById(req.user.id).select('-password');
            const newPost = new Post({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            });
            console.log(user);
            const post = await newPost.save();
            res.json(post);
        }
        catch (err) {
            console.log(err.message);
            res.status(500).send('Server Error');
        }





    });

//@route    POST api/posts
//@desc     To show all posts 
//@access   Private
//made it private , because we have to be logged in to see the posts
router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });
        //just grabbed al the post from the Post model and applied sort() to it
        // we wrote -1 in sort because we want the most recent posts first 
        //by default its the oldestfirst or u can write +1
        res.json(posts);
    }
    catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
})


//@route    GET api/posts/:id
//@desc     Get current users posts
//@access   Private
router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        //this if condition will run if no posts are found for that particular id
        //what is that id is not valid so we will go the catch block
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        res.json(post);
    } catch (err) {
        console.error(err.message);
        //because we want the error messages to be same in catch block as well so for that
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' });
        }

        res.status(500).send('Server Error');
    }
});

//@route    DELETE api/posts/:id
//@desc     Delete a post
//@access   Private

router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);


        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        //to check whether the person who wants to delete the post , is the person who owns the post
        if (post.user.toString() !== req.user.id) {
            //we added to string() because req.user.id is a string while post.user is not 
            return res.status(401).json({ msg: 'User not authorized' });
            //401 status - not authorized
        }


        await post.remove();

        res.json({ msg: 'Post removed' });
    } catch (err) {
        console.error(err.message);
        //because we want the error messages to be same in catch block as well so for that
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' });
        }

        res.status(500).send('Server Error');
    }
});

// @route    PUT api/posts/unlike/:id
// @desc     unLike a post
// @access   Private
router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // Check if the post has already been liked
        if (post.likes.filter((like) => like.user.toString() === req.user.id).length == 0) {
            return res.status(400).json({ msg: 'Post has not been liked' });
        }

        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);
        post.likes.splice(removeIndex, 1);

        await post.save();

        return res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
// @route    PUT api/posts/like/:id
// @desc     Like a post
// @access   Private
router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // Check if the post has already been liked
        if (post.likes.filter((like) => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: 'Post already liked' });
        }
        //unshift is same as push just it puts things in the beginning
        post.likes.unshift({ user: req.user.id });

        await post.save();

        return res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


//@route    POST api/posts/comment/:id
//@desc     comment on  a post
//@access   Private
//private , because the user has to be logged in to create post

router.post('/comment/:id', [auth, [
    body('text', 'Text is required').not().isEmpty()]], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //we need the user, its avatar ,name etc , which comes from users db so thats why called user model
        try {

            const user = await User.findById(req.user.id).select('-password');
            const post = await Post.findById(req.params.id);
            const newComment = {
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            };
            post.comments.unshift(newComment);
            await post.save();
            res.json(post.comments);
        }
        catch (err) {
            console.log(err.message);
            res.status(500).send('Server Error');
        }





    });

// @route    DELETE api/posts/comment/:id/:comment_id
// @desc     Delete comment
// @access   Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // Pull out comment
        //find is a high order array method
        const comment = post.comments.find(
            (comment) => comment.id === req.params.comment_id
        );
        // Make sure comment exists
        if (!comment) {
            return res.status(404).json({ msg: 'Comment does not exist' });
        }
        // Check user
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id);
        post.comments.splice(removeIndex, 1);

        await post.save();



        return res.json(post.comments);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
    }
});

module.exports = router;