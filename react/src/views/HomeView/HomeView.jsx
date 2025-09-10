import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from "../../context/UserContext";
import CookoutService from "../../services/CookoutService";
import { useLocation, useNavigate } from 'react-router-dom';
import './HomeView.css';
import Modal from '../../components/Modal/Modal';
import CookoutMenuService from '../../services/CookoutMenuService';
import MenuItemService from '../../services/MenuItemService';
import UserService from '../../services/UserService';


function CookoutCard({ cookout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(UserContext);
  const userId = user?.id;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cookoutMenu, setCookoutMenu] = useState([]);
  const [cookoutMenuItems, setCookoutMenuItems] = useState([]);
  const [selectedCookout, setSelectedCookout] = useState();
  const [loading, setLoading] = useState(true);
  const [hostUsername, setHostUsername] = useState("");

  const cookoutId = cookout.id || cookout.cookoutId;  
  const storageKey = `rsvp-${cookoutId}`;
  const isHost = cookout.hostId === userId;

  const [rsvpStatus, setRsvpStatus] = useState(() => {
    const stored = localStorage.getItem(storageKey);
    return stored === "Yes" ? "Yes" : "No"; // default to "No"
  });

  useEffect(() => {
    console.log(`RSVP for cookout ${cookoutId}:`, rsvpStatus);
  }, [rsvpStatus]);

  const handleRsvpClick = () => {
    const next = rsvpStatus === "Yes" ? "No" : "Yes";
    localStorage.setItem(storageKey, next);
    setRsvpStatus(next);
  };
    
  useEffect(() => {
    async function fetchHostUsername() {
      if (cookout.hostId) {
        try {
          const response = await UserService.getUserById(cookout.hostId);
          setHostUsername(response.data.username);
        } catch (err) {
          console.error("Failed to fetch host username:", err);
        }
      }
    }

    fetchHostUsername();
  }, [cookout.hostId]);


  const handleOpenModal = (cookout) => {
    setSelectedCookout(cookout);
    setIsModalOpen(true);
    setLoading(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  }

  const handleMenuClick = (cookout) => {
    async function fetchMenu() {

      try {
        const menuIds = await CookoutMenuService.getCookoutMenuByCookoutId(cookout.id);
        const fetchedMenuItems = menuIds.data;
        setCookoutMenuItems(menuIds.data);



        const itemIds = fetchedMenuItems.map(item => item.menuItemId);

        const itemData = itemIds.map(id => MenuItemService.getMenuItemById(id));

        const itemResponse = await Promise.all(itemData);
        const menuItemData = itemResponse.map(response => response.data)
        setCookoutMenu(menuItemData);

        if (!(menuItemData.length > 0) && (cookout.hostId === userId)) {
          navigate("/menu");
        } else {
          handleOpenModal(cookout);
        }

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false)
      }

    }
    fetchMenu();




  }

  return (
    <div className="cookout-card">
      <div className="cookout-header">
        <h3>{cookout.cookoutName || "No Title"}</h3>
        <span className="cookout-date">{cookout.cookoutDate || "No Date"}</span>
      </div>

      <div className="cookout-details">
        <p><strong>Location:</strong> {cookout.cookoutLocation || "No Location"}</p>
        <p><strong>Host:</strong> {hostUsername || "No Host"}</p>
        <p><strong>Time:</strong> {cookout.cookoutTime || "No Time"}</p>
      </div>

      <div className="cookout-actions">
        {!isHost && (
          <button className="btn-primary" onClick={handleRsvpClick}>
            RSVP: {rsvpStatus}
          </button>
        )} {/* as attendee */}

        <button className="btn-secondary" onClick={() => navigate(`/cookout/${cookout.id}`)}>Details</button>

        <button className="btn-third" onClick={() => handleMenuClick(cookout)}>Menu</button>
        {isHost && (
        <button className="bnt-four"
        onClick={() => navigate("/invite", { state: { cookoutId: cookout.id } })}>
        Guests
        </button>
        )} {/* as host */}
      </div>

      <p>{cookout.location}</p>
      <p>{cookout.host}</p>
{/*
      <a className="button-link" href="#">View Cookout</a>*/}
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <>
<h3>Menu</h3>

          {
            cookoutMenu.length > 0 ?
              (loading ? <p>loading...</p> : (
                <>
                  {cookoutMenu.map((menuItem, index) => (
                    <div key={index}>
                      <h4>{menuItem.menuItemName}</h4>
                      <p>{menuItem.itemDescription}</p>
                    </div>

                  ))}
                  <button onClick={() => (navigate("/order"))}>Order Now!</button>

                </>
              ))
              : <p>No menu Yet!</p>}
        </>
      </Modal>
    </div>
  );
}

function CookoutList() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(UserContext);
  const userId = user?.id;

  const [cookouts, setCookouts] = useState({
    hosting: [],
    attending: [],
    chef: []
  });

  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const [currentUser, setCurrentUser] = useState(null);


  const handleLogout = () => {

    localStorage.removeItem("token");
    
    navigate("/login");
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  useEffect(() => {
    if (!userId) {"/login"};
  
    const fetchCookouts = async () => {
      try {
        const response = await CookoutService.getCookoutsByUserIdForViewCookouts(userId);
        console.log("Cookouts fetched:", response.data);
        setCookouts(response.data);
      } catch (error) {
        console.error("Failed to fetch cookouts:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCookouts();
  }, [userId]);

  const allCookouts = [
    ...cookouts.hosting,
    ...cookouts.attending,
    ...cookouts.chef,
  ];

  const filterCookouts = allCookouts.filter(cookout => {
    if (filter === 'all') return true;

    const now = new Date();
    const cookoutDate = new Date(cookout.date);

    if (filter === 'upcoming') return cookoutDate >= now;
    if (filter === 'past') return cookoutDate < now;
    return true;
  });

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  if (loading) {
    return <div className="loading">Loading cookouts...</div>;
  }

  return (
    <>
      <header>
        <h1>The Cookout</h1>
        <div>
          <button className="regular-btn" onClick={handleHomeClick}>Home</button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className="cookout-list-container">
        <div className="cookout-list-header">
          <h1>Upcoming Cookouts</h1>
          <p>Join us for some delicious outdoor dining!</p>
        </div>

        <div className="filter-buttons">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => handleFilterChange('all')}
          >
            All Events
          </button>
          {/*<button
            className={filter === 'upcoming' ? 'active' : ''}
            onClick={() => handleFilterChange('upcoming')}
          >
            Upcoming
          </button>
          <button
            className={filter === 'past' ? 'active' : ''}
            onClick={() => handleFilterChange('past')}
          >
            Past Events
          </button>
    */}


        </div>

        <div className="cookout-list">
          {filterCookouts.length === 0 ? (
            <div className="no-cookouts">
              <p>No cookouts found.</p>
            </div>
          ) : (
            filterCookouts.map((cookout, index) => (
              <CookoutCard key={`${cookout.cookoutId || cookout.id}-${index}`} cookout={cookout} />
            ))
          )}
        </div>

        <div className="add-cookout">
          <button className="btn-add" onClick={() => (navigate("/cookouts"))}>+ Add New Cookout</button>
        </div>

      </div>
    </>
  );
}

export default CookoutList;