import axios from 'axios';

export default {

    getCookoutMenuByCookoutId(cookoutId) {
        return axios.get(`${import.meta.env.VITE_REMOTE_API}/CookoutMenu/${cookoutId}`);
    },

    createCookoutMenu(cookoutMenuData) {
        const payload = {
            cookoutId: cookoutMenuData.cookoutId,
            menuItemId: cookoutMenuData.menuItemId
        }
        return axios.post(`${import.meta.env.VITE_REMOTE_API}/CookoutMenu`, payload);
    },

    deleteCookoutMenuByCookoutIdMenuItemId(cookoutId, menuItemId) {
        return axios.delete(`${import.meta.env.VITE_REMOTE_API}/CookoutMenu/${cookoutId}/${menuItemId}`);
    }
}