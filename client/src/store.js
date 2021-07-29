import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';//middleware
import rootReducer from './reducers'; //all reducers are combined in the root reducer


const initialState = {};

const middleware = [thunk];//the only middleware we have is thunk 
const store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;