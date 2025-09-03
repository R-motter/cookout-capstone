import axios from "axios";

export default {

  createCookout(cookoutData) {
    const payload = {
      cookoutName: cookoutData.cookoutName,
      cookoutDate: cookoutData.cookoutDate,
      cookoutTime: cookoutData.cookoutTime,
      cookoutLocation: cookoutData.cookoutLocation,
      chefUsername: cookoutData.chefUsername
    };
    return axios.post(`${import.meta.env.VITE_REMOTE_API}/cookouts`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  },


  getCookoutById(cookoutId) {
    return axios.get(`${import.meta.env.VITE_REMOTE_API}/cookouts/${cookoutId}`);
  },

  getCookoutsByHost() {
    return axios.get(`${import.meta.env.VITE_REMOTE_API}/cookouts/hosts`);
  },

  updateCookout(cookoutData, cookoutId) {
    const payload = {
      cookoutName: cookoutData.cookoutName,
      cookoutDate: cookoutData.cookoutDate,
      cookoutTime: cookoutData.cookoutTime,
      cookoutLocation: cookoutData.cookoutLocation,
      chefUsername: cookoutData.chefUsername,
      hostId: cookoutData.hostId
    };
    return axios.put(`${import.meta.env.VITE_REMOTE_API}/cookouts/${cookoutId}`, payload, {
      headers: { "Content-Type": "application/json" }
    });

  }, 
  //this gets cookouts by user id, and lets us filter cookouts by role id
  getCookoutsByUserId(userId) {
    return axios.get(`${import.meta.env.VITE_REMOTE_API}/cookouts/user/${userId}`)
      .then(response => response.data);

  },

  getCookoutsByUserIdForViewCookouts(userId) {
    return axios.get(`${import.meta.env.VITE_REMOTE_API}/cookouts/user/${userId}`)
  }, 

  getMenuItems(cookoutId) {
    return axios.get(`${import.meta.env.VITE_REMOTE_API}/cookouts/menus/${cookoutId}`);
  },

  getGuestList(cookoutId) {
    return axios.get(`${import.meta.env.VITE_REMOTE_API}/cookouts/guests/${cookoutId}`);
  }
};


