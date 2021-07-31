import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth'

export default combineReducers({
    alert,
    auth
});
//all the reducers that we create will be added here