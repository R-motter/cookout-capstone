import axios from 'axios';

export default {
    getInviteById(inviteId) {
        return axios.get(`${import.meta.env.VITE_REMOTE_API}/invite/${inviteId}`);
    },

    getInvitesByAttendeeId(attendeeId) {
        return axios.get(`${import.meta.env.VITE_REMOTE_API}/invite/attendee/${attendeeId}`);
    },

    createInvite({ cookoutId, attendeeUsername }) {
        const payload = {
            cookoutId, 
            attendeeUsername: attendeeUsername || null
        };
        return axios.post(`${import.meta.env.VITE_REMOTE_API}/invite`, payload)
    },

    updateInvite(inviteData, inviteId) {
        const payload = {
            attendeeId: inviteData.attendeeId,
            cookoutId: inviteData.cookoutId,
            id: inviteData.inviteId
        }
        return axios.put(`${import.meta.env.VITE_REMOTE_API}/invite/${inviteId}`, payload)
    },

    getInvitesByUser(){
        return axios.get(`${import.meta.env.VITE_REMOTE_API}/invite/user`);
    },

    getInvitesByCookoutId(cookoutId) {
        return axios.get(`${import.meta.env.VITE_REMOTE_API}/invite/cookout/${cookoutId}`);
    }, 

    getInvitesByCookoutId(cookoutId) {
        return axios.get(`${import.meta.env.VITE_REMOTE_API}/invite/cookout/${cookoutId}`);
    }, 

    deleteInvite(cookoutId, username) {
        return axios.delete('http://localhost:9000/invite/invites', {
          params: { cookoutId, username }
        });
    }
}