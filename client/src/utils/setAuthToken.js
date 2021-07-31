import axios from 'axios';

const setAuthToken = (token) => {
    if (token) {
        axios.defaults.headers.common['x-auth-token'] = token;
    }
    else {
        delete axios.defaults.headers.common['x-auth-token'];
    }
}
//the purpose of making this is , that if we have a token , we will send it with every request 
// so if any api call needs this token , they will take it , other wise it will just be a header

export default setAuthToken;