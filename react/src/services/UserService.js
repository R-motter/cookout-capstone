import axios from 'axios';

export default {

    getIdByUsername(username) {
        return axios.get(`${import.meta.env.VITE_REMOTE_API}/users/username/${username}`);
    },

    getAllUsers() {
        return axios.get(`${import.meta.env.VITE_REMOTE_API}/users`);
        
    }, 

    createAttendeeSelection(selectedUsernames) {
        return axios.post(`${import.meta.env.VITE_REMOTE_API}/users/attendee-selection`, selectedUsernames
        );
    },

    getIdByUser(){
        return axios.get(`${import.meta.env.VITE_REMOTE_API}/users/user`);
    }, 
    getUserById(id) {
        return axios.get(`${import.meta.env.VITE_REMOTE_API}/users/${id}`);
    }
};