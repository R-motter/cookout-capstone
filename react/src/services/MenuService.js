import axios from 'axios';


export default {

    getMenuById(menuId) {
        return axios.get(`${import.meta.env.VITE_REMOTE_API}/menu/${menuId}`);
    },

   /* createMenu(menuData) {
        const payload = {
            cookoutId: menuData.cookoutId
        }
        return axios.post(`${import.meta.env.VITE_REMOTE_API}/CookoutMenu`, payload);
    },*/

    updateMenu(menuData, menuId) {
        const payload = {
            menuId: menuData.menuId,
            cookoutId: menuData.cookoutId
        }
        return axios.put(`${import.meta.env.VITE_REMOTE_API}/menu/${menuId}`, payload);
    }

}