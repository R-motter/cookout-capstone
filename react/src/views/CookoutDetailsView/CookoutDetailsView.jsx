import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import CookoutService from '../../services/CookoutService';
import UserService from '../../services/UserService';
import InviteService from '../../services/InviteService';
import MenuItemService from '../../services/MenuItemService';
import CookoutMenuService from '../../services/CookoutMenuService';
import OrderService from '../../services/OrderService';
import Modal from '../../components/Modal/Modal';
import './cookoutDetailView.css';

export default function CookoutDetailsView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [cookout, setCookout] = useState(null);
    const [hostName, setHostName] = useState("");
    const [chefName, setChefName] = useState("");
    const [menuItems, setMenuItems] = useState([]);
    const [guests, setGuests] = useState([]);
    const [userId, setUserId] = useState();
    const [isModalOpen, setIsModalOpen] = useState();
    const [orders, setOrders] = useState([]);
    const [orderItemNames, setOrderItemNames] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCookout, setSelectedCookout] = useState();

    const handleHomeClick = () => {
        navigate('/');
    };

    const handleLogoutClick = () => {
        localStorage.removeItem('authToken');
        sessionStorage.clear();
        navigate('/login');
    };

    const handleOpenModal = (cookout) => {
        setSelectedCookout(cookout);
        setIsModalOpen(true);
        setIsLoading(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    }

    const handleOrderFinish = async (order, orderId) => {
        const newOrder = {
            orderId: orderId,
            menuItemId: order.menuItemId,
            attendeeId: order.attendeeId,
            cookoutId: order.cookoutId,
            quantity: order.quantity,
            completedOrder: true
        }
        try {
            await OrderService.updateOrder(newOrder, orderId);
            handleOrderClick(selectedCookout);
        } catch(error) { 
            console.log(error);
        }
    }

    const handleOrderClick = (cookout) => {
        async function fetchOrders() {
            try {
                const orders = await OrderService.getOrdersByCookoutId(cookout.id);
                setOrders(orders.data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false)
            }
        }
        fetchOrders();
        setSelectedCookout(cookout);
        handleOpenModal(cookout);
    }

    useEffect(() => {
        async function fetchMenuItems() {
            if (orders.length > 0) {
                const itemData = orders.map(order =>
                    MenuItemService.getMenuItemById(order.menuItemId)
                );
                try {
                    const itemResponses = await Promise.all(itemData);
                    const newMenuItemsMap = {};
                    itemResponses.forEach(response => {
                        const item = response.data;
                        newMenuItemsMap[item.menuItemId] = item;
                    });
                    setOrderItemNames(newMenuItemsMap);
                } catch (error) {
                    console.error(error);
                }
            }
        }
        fetchMenuItems();
    }, [orders]);

    useEffect(() => {
        async function fetchCookout() {
            try {
                const response = await CookoutService.getCookoutById(id);
                const cookoutData = response.data;
                setCookout(cookoutData);

                if (cookoutData.hostId) {
                    const hostRes = await UserService.getUserById(cookoutData.hostId);
                    setHostName(hostRes.data.username);
                }

                if (cookoutData.chefId) {
                    const chefRes = await UserService.getUserById(cookoutData.chefId);
                    setChefName(chefRes.data.username);
                }

                const cookoutMenuRes = await CookoutMenuService.getCookoutMenuByCookoutId(id);
                const cookoutMenuLinks = cookoutMenuRes.data || [];

                const menuItemPromises = cookoutMenuLinks.map(link =>
                    MenuItemService.getMenuItemById(link.menuItemId)
                );
                const menuItemResponses = await Promise.all(menuItemPromises);
                console.log("Menu item responses:", menuItemResponses);
                const fullMenuItems = menuItemResponses.map(res => res.data);
                console.log("Final menu items:", fullMenuItems);
                setMenuItems(fullMenuItems);
                console.table(fullMenuItems);

                const inviteRes = await InviteService.getInvitesByCookoutId(id);
                const guestUsernames = inviteRes.data.map(invite => invite.attendeeUsername);
                setGuests(guestUsernames);

                const userRes = await UserService.getIdByUser();
                setUserId(userRes.data);

            } catch (error) {
                console.error("Failed to fetch cookout details:", error);
            }
        }

        fetchCookout();
    }, [id]);

    if (!cookout) return <p>Loading cookout details...</p>;

    return (
        <>
            <header>
                <h1>The Cookout</h1>
                <div>
                    <button className="regular-btn" onClick={handleHomeClick}>Home</button>
                    <button className="logout-btn" onClick={handleLogoutClick}>Logout</button>
                </div>
            </header>
            <main>
                <section id="main-section">
                    <h3>{cookout.cookoutDate}</h3>
                    <h1>{cookout.cookoutName}</h1>
                    <h4>Hosted By: {hostName || `ID ${cookout.hostId}`}</h4>
                </section>

                <section className="info-section">
                    <h2>Date and Time</h2>
                    <p>{cookout.cookoutDate}</p>
                    <p>{cookout.cookoutTime}</p>
                </section>

                <section className="info-section">
                    <h2>Location</h2>
                    <p>{cookout.cookoutLocation}</p>
                </section>

                <section className="info-section">
                    <h2>Chef</h2>
                    <p>{chefName || `ID ${cookout.chefId}`}</p>
                </section>

                <section>
                    <div id="dual-list">
                        <div id="single-list">
                            <h3>Menu</h3>
                            {menuItems.length > 0 ? (
                                <ul>
                                    {menuItems.map((item) => (
                                        <li key={item.menuItemId}>
                                            <strong>{item.menuItemName}</strong>: {item.itemDescription}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <ul>
                                    <li>No menu items available.</li>
                                </ul>
                            )}
                        </div>
                        
                        <div id="single-list">
                            <h3>Guest List</h3>
                            <ul>
                                {guests.length > 0 ? (
                                    guests.map((username, index) => <li key={index}>{username}</li>)
                                ) : (
                                    <li>No guests yet</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </section>

                {userId === cookout.chefId && (
                    <div style={{padding: '0 45px', marginTop: '25px'}}>
                        <button className="regular-btn" onClick={() => handleOrderClick(cookout)}>
                            View Orders
                        </button>
                    </div>
                )}

                <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                    <>
                        <h3>Orders</h3>
                        {orders.length > 0 ? (
                            isLoading ? <p>loading...</p> : (
                                <>
                                    <h2>Orders:</h2>
                                    {orders.map((order, index) => {
                                        const item = orderItemNames[order.menuItemId];
                                        
                                        if (!item) {
                                            return <p key={index}>Loading item details...</p>;
                                        }

                                        if(order.completedOrder === false) {
                                            return (
                                                <div key={index}>
                                                    <h4>Item</h4>
                                                    <p>{item.menuItemName}</p>
                                                    <button onClick={() => { handleOrderFinish(order, order.orderId) }}>
                                                        Finish Order
                                                    </button>
                                                </div>
                                            );
                                        } else {
                                            return (
                                                <div key={index}>
                                                    <h4>Item</h4>
                                                    <p>{item.menuItemName}</p>
                                                    <p>All Done!</p>
                                                </div>
                                            );
                                        }
                                    })}
                                </>
                            )
                        ) : (
                            <p>No Orders Yet!</p>
                        )}
                    </>
                </Modal>
            </main>
        </>
    );
}

