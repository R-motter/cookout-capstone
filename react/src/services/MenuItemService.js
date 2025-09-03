import axios from 'axios';

export default {

    getAllMenuItems() {
        return axios.get(`${import.meta.env.VITE_REMOTE_API}/menuItem`);
    },



    getMenuItemById(menuItemId){
        return axios.get(`${import.meta.env.VITE_REMOTE_API}/menuItem/${menuItemId}`);
    },

    createMenuItem(menuItemData) {
        const payload = {
            menuItemName: menuItemData.menuItemName,
            itemDescription: menuItemData.itemDescription
        }
        return axios.post(`${import.meta.env.VITE_REMOTE_API}/menuItem`, payload);
    }

}