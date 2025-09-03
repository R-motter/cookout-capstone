import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import CookoutMenuService from '../../services/CookoutMenuService.js';
import MenuItemService from '../../services/MenuItemService.js';
import CookoutService from '../../services/CookoutService.js';
import InviteService from '../../services/InviteService.js';
import OrderService from '../../services/OrderService.js';
import './OrderView.css';

export default function OrderView() {
    const navigate = useNavigate();
    
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentCookout, setCurrentCookout] = useState();
    const [invites, setInvites] = useState([]);
    const [cookoutIds, setCookoutIds] = useState([]);
    const [cookouts, setCookouts] = useState([]);

    const [cookoutMenuItems, setCookoutMenuItems] = useState([]);
    const [cookoutMenu, setCookoutMenu] = useState([]);
    const [selectedItem, setSelectedItem] = useState();
    const [attendeeId, setAttendeeId] = useState();

    const handleHomeClick = () => {
        navigate('/');
    };

    const handleLogoutClick = () => {
        localStorage.removeItem('authToken');
        sessionStorage.clear();
        navigate('/login');
    };

    const handleSelectChangeCookout = (e) => {
        const selectedCookoutId = e.target.value;
        setCurrentCookout(selectedCookoutId);

        if (!selectedCookoutId) {
            setCookoutMenu([]);
            return;
        }

        setLoading(true);

        async function fetchMenu() {
            try {

                const menuIds = await CookoutMenuService.getCookoutMenuByCookoutId(selectedCookoutId);
                const fetchedMenuItems = menuIds.data;
                setCookoutMenuItems(menuIds.data);



                const itemIds = fetchedMenuItems.map(item => item.menuItemId);

                const itemData = itemIds.map(id => MenuItemService.getMenuItemById(id));

                const itemResponse = await Promise.all(itemData);
                const menuItemData = itemResponse.map(response => response.data)
                setCookoutMenu(menuItemData);

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchMenu();

    }

    function handleSubmit() {
        const parsedMenuItem = parseInt(selectedItem, 10);
        const parsedAttendee = parseInt(attendeeId, 10);
        const parsedCookout = parseInt(currentCookout, 10);
        const order = {
            menuItemId: parsedMenuItem,
            attendeeId: parsedAttendee,
            cookoutId: parsedCookout,
            quantity: 1,
            completedOrder: false
        }
        OrderService.createOrder(order);
    }

    useEffect(() => {


        async function fetchData() {
            setLoading(true);
            try {
                const response = await InviteService.getInvitesByUser();
                setInvites(response.data);

                const ids = response.data.map(invite => invite.cookoutId);
                setCookoutIds(ids);

                const userId = response.data.map(invite => invite.attendeeId);
                setAttendeeId(userId);

                const cookoutData = ids.map(id => CookoutService.getCookoutById(id));

                const cookoutResponse = await Promise.all(cookoutData);
                setCookouts(cookoutResponse.map(response => response.data));
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();

    }, [])

    return (
        <>

<header>
                <h1>The Cookout</h1>
                <div>
                    <button className="regular-btn" onClick={handleHomeClick}>Home</button>
                    <button className="logout-btn" onClick={handleLogoutClick}>Logout</button>
                </div>
            </header>
            <h1>Place Your Order: </h1>
            {loading ? (<p>loading...</p>) : (
                <form>
                    <select id="cookout"
                        value={currentCookout}
                        onChange={handleSelectChangeCookout}>
                        <option value="">-- Please Select a Cookout --</option>
                        {
                            cookouts.map((cookout, index) => (
                                <option key={index} value={cookout.id}>{cookout.cookoutName}</option>
                            )
                            )
                        }
                    </select>

                    {!currentCookout ? <p></p> : (
                        <>
                            <select id="menu"
                                value={selectedItem}
                                onChange={(e) => setSelectedItem(e.target.value)}>
                                <option value="">-- Menu Options --</option>
                                {cookoutMenu.length > 0 ? (
                                    cookoutMenu.map((item, index) => (
                                        <option key={index} value={item.menuItemId}>{item.menuItemName}</option>
                                    ))) : (
                                    <option>No Menu Created Yet</option>
                                )
                                }
                            </select>
                            <button type="submit" onClick={handleSubmit}>Submit</button>
                        </>
                    )}

                </form>
            )}

        </>
    )

}