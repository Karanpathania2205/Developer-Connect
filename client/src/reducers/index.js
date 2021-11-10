import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import profile from './profile';
import post from './post';

export default combineReducers({
    alert,
    auth,
    profile,
    post
});
//all the reducers that we create will be added here