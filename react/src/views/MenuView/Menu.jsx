import { useState, useEffect } from 'react';
import MenuItemService from '../../services/MenuItemService';
import CookoutMenuService from '../../services/CookoutMenuService';
import CookoutService from '../../services/CookoutService';
import { useNavigate } from 'react-router-dom';
import './Menu.css';

export default function Menu() {
    const navigate = useNavigate();
    const [selectedCookoutId, setSelectedCookoutId] = useState('');
    const [menuItems, setMenuItems] = useState([]);
    const [cookouts, setCookouts] = useState([]);
    const [existingMenu, setExistingMenu] = useState([]);
    const [selectedItems, setSelectedItems] = useState(['', '', '', '']);
    const [itemOne, setItemOne] = useState('');
    const [itemTwo, setItemTwo] = useState('');
    const [itemThree, setItemThree] = useState('');
    const [itemFour, setItemFour] = useState('');
    const [oneDescription, setOneDescription] = useState('');
    const [twoDescription, setTwoDescription] = useState('');
    const [threeDescription, setThreeDescription] = useState('');
    const [fourDescription, setFourDescription] = useState('');
    const [itemOneId, setItemOneId] = useState();
    const [itemTwoId, setItemTwoId] = useState();
    const [itemThreeId, setItemThreeId] = useState();
    const [itemFourId, setItemFourId] = useState();

    const handleHomeClick = () => {
        navigate('/');
    };

    const handleLogoutClick = () => {
        localStorage.removeItem('authToken');
        sessionStorage.clear();
        navigate('/login');
    };

    useEffect(() => {
        async function fetchInitialData(){
            try {
                const [menuResponse, cookoutResponse] = await Promise.all([
                    MenuItemService.getAllMenuItems(),
                    CookoutService.getCookoutsByHost()
                ]);

                setMenuItems(menuResponse.data);
                setCookouts(cookoutResponse.data);
            } catch(error){
                console.error("Error loading data: ", error);
            }
        }

        fetchInitialData();
    }, []);

    useEffect(() => {
        if (!selectedCookoutId) return;

        async function fetchCookoutMenu() {
            try {
                const response = await CookoutMenuService.getCookoutMenuByCookoutId(selectedCookoutId);
                const menu = response.data || [];

                setExistingMenu(menu);

                const items = menu.map(item => item.menuItemId);
                setSelectedItems([
                    items[0] || '',
                    items[1] || '',
                    items[2] || '',
                    items[3] || ''
                ]);
            } catch (error) {
                console.error("Error fetching cookout menu:", error);
                setExistingMenu([]);
                setSelectedItems(['', '', '', '']);
            }
        }

        fetchCookoutMenu();
    }, [selectedCookoutId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            if (!selectedCookoutId) {
                alert("Please select a cookout.");
                return;
            }
    
            const menuItemsToCreate = [
                { menuItemName: itemOne, itemDescription: oneDescription },
                { menuItemName: itemTwo, itemDescription: twoDescription },
                { menuItemName: itemThree, itemDescription: threeDescription },
                { menuItemName: itemFour, itemDescription: fourDescription }
            ];
    
            const responses = await Promise.all(
                menuItemsToCreate.map(item => MenuItemService.createMenuItem(item))
            );
    
            const newMenuItemIds = responses.map(response => response.data.menuItemId);
            
            const cookoutMenuItemsToCreate = newMenuItemIds.map(id => ({
                cookoutId: selectedCookoutId,
                menuItemId: id
            }));
    
            await Promise.all(
                cookoutMenuItemsToCreate.map(item => CookoutMenuService.createCookoutMenu(item))
            );
    
            alert("Menu successfully saved.");
    
            navigate("/");

        } catch(error) {
            console.error("Error submitting menu: ", error);
            alert("An error occurred while submitting the menu.");
        }
    };

    return (
        <>
            <header>
                <h1>The Cookout</h1>
                <div>
                    <button className="regular-btn" onClick={handleHomeClick}>Home</button>
                    <button className="logout-btn" onClick={handleLogoutClick}>Logout</button>
                </div>
            </header>

            <form onSubmit={handleSubmit}>
                <select
                    id="cookout"
                    value={selectedCookoutId}
                    onChange={(e) => setSelectedCookoutId(e.target.value)}
                >
                    <option value="">Please Select a Cookout</option>
                    {
                        cookouts.map((cookout) => (
                            <option key={cookout.id} value={cookout.id}>
                                {cookout.cookoutName}
                            </option>
                        ))
                    }
                </select>
                <h2>Please enter items for your menu: </h2>
                <h3>Item one</h3>
                <input value={itemOne} onChange={(e) => setItemOne(e.target.value)}></input>
                <p>Description</p>
                <input value={oneDescription} onChange={(e) => setOneDescription(e.target.value)}></input>
                <h3>Item two</h3>
                <input value={itemTwo} onChange={(e) => setItemTwo(e.target.value)}></input>
                <p>Description</p>
                <input value={twoDescription} onChange={(e) => setTwoDescription(e.target.value)}></input>
                <h3>Item three</h3>
                <input value={itemThree} onChange={(e) => setItemThree(e.target.value)}></input>
                <p>Description</p>
                <input value={threeDescription} onChange={(e) => setThreeDescription(e.target.value)}></input>
                <h3>Item four</h3>
                <input value={itemFour} onChange={(e) => setItemFour(e.target.value)}></input>
                <p>Description</p>
                <input value={fourDescription} onChange={(e) => setFourDescription(e.target.value)}></input>

                <button className='menu-button' type="submit">Submit</button>
            </form>
        </>
    )
}