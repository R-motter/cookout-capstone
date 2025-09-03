import axios from 'axios';

export default {

    getOrderById(orderId) {
        return axios.get(`${import.meta.env.VITE_REMOTE_API}/orders/${orderId}`);
    },

    getOrderByAttendeeIdCookoutId(attendeeId, cookoutId) {
        return axios.get(`${import.meta.env.VITE_REMOTE_API}/orders/${attendeeId}?cookout_id=${cookoutId}`);
    },

    getOrdersByCookoutId(cookoutId) {
        return axios.get(`${import.meta.env.VITE_REMOTE_API}/orders/all/${cookoutId}`);
    },

    createOrder(orderData) {
        const payload = {
            menuItemId: orderData.menuItemId,
            attendeeId: orderData.attendeeId,
            cookoutId: orderData.cookoutId,
            quantity: orderData.quantity,
            completedOrder: orderData.completedOrder
        }
        return axios.post(`${import.meta.env.VITE_REMOTE_API}/orders`, payload);
    },

    updateOrder(orderData, orderId) {
        const payload = {
            orderId: orderData.orderId,
            menuItemId: orderData.menuItemId,
            attendeeId: orderData.attendeeId,
            cookoutId: orderData.cookoutId,
            quantity: orderData.quantity,
            completedOrder: orderData.completedOrder
        }
        return axios.put(`${import.meta.env.VITE_REMOTE_API}/orders/${orderId}`, payload)
    }

}