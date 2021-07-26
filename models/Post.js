const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    //user , because we want tje user only to delete his her posts
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    text: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    avatar: {
        type: String
    },
    likes: [
        //user included in ikes so that , we know likes are coming from which user
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users'
            }
        }
    ],
    comments: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users'
            },
            text: {
                type: String,
                required: true
            },
            name: {
                type: String
            },
            avatar: {
                type: String
            },
            //date of the comment
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    //date of the post
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Post = mongoose.model('post', PostSchema);