import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import profile from './profile'

export default combineReducers({
    alert,
    auth,
    profile
});
//all the reducers that we create will be added here