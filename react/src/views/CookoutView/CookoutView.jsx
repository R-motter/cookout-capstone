import React, { useState, useEffect } from 'react';
import styles from './CookoutView.module.css';
import UserService from '../../services/UserService';
import CookoutService from '../../services/CookoutService';
import CookoutMenuService from '../../services/CookoutMenuService';
import MenuItemService from '../../services/MenuItemService';
import Modal from '../../components/Modal/Modal';




/*export const MyCookouts = ({ userId }) => {

  const [cookouts, setCookouts] = useState({ hosting: [], attending: [], chef: [] });

  useEffect(() => {
    getCookoutsByUserId(userId)
      .then(data => setCookouts(data))
      .catch(() => setCookouts({ hosting: [], attending: [], chef: [] }));
  }, [userId]);

  return (
    <div>
      <h2>Hosting</h2>
      {cookouts.hosting.map(cookout => (
        <div key={cookout.cookoutId}>
          {cookout.name} - {cookout.cookoutDate}
        </div>
      ))}

      <h2>Attending</h2>
      {cookouts.attending.map(cookout => (
        <div key={cookout.cookoutId}>
          {cookout.name} - {cookout.cookoutDate}
        </div>
      ))}

      <h2>Chef</h2>
      {cookouts.chef.map(cookout => (
        <div key={cookout.cookoutId}>
          {cookout.name} - {cookout.cookoutDate}
        </div>
      ))}
    </div>
  );
};*/


//function CookoutDetail({ cookoutId, onBack })
export default function CookoutView() {

  const [userId, setUserId] = useState();
  const [cookouts, setCookouts] = useState([]);
  const [attendingCookouts, setAttendingCookouts] = useState([]);
  const [hostingCookouts, setHostingCookouts] = useState([]);
  const [chefCookouts, setChefCookouts] = useState([]);
  const [currentCookoutDetails, setCurrentCookoutDetails] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ selectedCookout, setSelectedCookout ] = useState(null);
  const [ cookoutMenuItems, setCookoutMenuItems ] = useState([]);
  const [ cookoutMenu, setCookoutMenu ] = useState([]);

  const handleOpenModal = (cookout) => {
    setSelectedCookout(cookout);
    setIsModalOpen(true);
    setIsLoading(true);
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

      } catch (error) {
          console.error(error);
      } finally { 
        setIsLoading(false)
    }
  }
  fetchMenu();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  }

  useEffect(() => {

    async function fetchData() {
      setIsLoading(true);
      try {
        const userResponse = await UserService.getIdByUser();
        setUserId(userResponse.data);

        const cookoutResponse = await CookoutService.getCookoutsByUserIdForViewCookouts(userResponse.data);
        setCookouts(cookoutResponse.data);

        setAttendingCookouts(cookoutResponse.data.attending);
        setHostingCookouts(cookoutResponse.data.hosting);
        setChefCookouts(cookoutResponse.data.chef);

      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
      fetchData();

    
}, [])


  return (
    <>
      <h1>Your Cookouts</h1>
      <h2>To Attend</h2>
      {
        attendingCookouts.length === 0 ? <p>No cookouts coming up! Maybe you should host one!</p> : (
          attendingCookouts.map((cookout) => (
            <div key={cookout.id}>
              <div>
                <h3>{cookout.cookoutName}</h3>
                <p>{cookout.cookoutDate}</p>
                <p>{cookout.cookoutTime}</p>
                <h4>{cookout.cookoutLocation}</h4>
              </div>
              <button onClick={() => handleOpenModal(cookout)}>View Menu</button>
            </div>
          ))
        )
      }
      <div>

      </div>
      <h2>Hosting</h2>
      {
        hostingCookouts.length === 0 ? <p>No Cookouts Coming Up!</p> : (
          hostingCookouts.map((cookout) => (
            <div key={cookout.id}>
              <div>
                <h3>{cookout.cookoutName}</h3>
                <p>{cookout.cookoutDate}</p>
                <p>{cookout.cookoutTime}</p>
                <h4>{cookout.cookoutLocation}</h4>
              </div>
              <button onClick={() => handleOpenModal(cookout)}>View Menu</button>
              
            </div>
          ))
        )
      }
      <div>

      </div>
      <h2>Chef</h2>
      {
        chefCookouts.length === 0 ? <p>Don't light the grill just yet!</p> : (
          chefCookouts.map((cookout) => (
            <div key={cookout.id}>
              <div>
                <h3>{cookout.cookoutName}</h3>
                <p>{cookout.cookoutDate}</p>
                <p>{cookout.cookoutTime}</p>
                <h4>{cookout.cookoutLocation}</h4>
              </div>
              <button onClick={() => handleOpenModal(cookout)}>View Menu</button>
            </div>
          ))
        )
      }
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <>
                  <h3>Menu</h3>

                  {
                    cookoutMenu.length > 0 ? 
                  (isLoading ? <p>loading...</p> : (
                    cookoutMenu.map((menuItem, index) => (
                      <div key={index}>
                        <h4>{menuItem.menuItemName}</h4>
                        <p>{menuItem.itemDescription}</p>
                      </div>
                    
                    ))
                  ))
                  : <p>No menu Yet!</p>}
                </>
              </Modal>
    </>
  )

/*
  const [cookout, setCookout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const API_BASE_URL = 'http://localhost:9000';


  useEffect(() => {

    const fetchCookoutDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log(`Fetching cookout details for ID: ${cookoutId}`);

        const response = await fetch(`${API_BASE_URL}/cookouts/${cookoutId}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch cookout: ${response.status} ${response.statusText}`);
        }

        const cookoutData = await response.json();
        console.log('Received cookout data:', cookoutData);

        setCookout(cookoutData);

      } catch (error) {
        console.error('Error fetching cookout details:', error);
        setError(`Failed to load cookout details: ${error.message}`);

        //SAMPLE DUMMY DATA CAN BE COMMENTED OUT
        setCookout({
          id: cookoutId,
          title: "Summer BBQ Bash (Sample Data)",
          date: "July 15, 2025",
          time: "2:00 PM - 8:00 PM",
          location: "Central Park, Pavilion A",
          address: "830 5th Ave, New York, NY 10065",
          host: "Sarah Johnson",
          hostEmail: "sarah@email.com",
          hostPhone: "(555) 123-4567",
          attendees: 25,
          maxAttendees: 50,
          description: "Join us for an amazing summer cookout with delicious food, great music, and fun activities for the whole family! We'll have games, live music, and plenty of space to relax and enjoy the beautiful weather. This is a perfect opportunity to meet neighbors and enjoy great food in a beautiful outdoor setting.",
          menu: [
            "BBQ Burgers",
            "Grilled Hot Dogs",
            "Grilled Corn on the Cob",
            "Classic Coleslaw",
            "Fresh Watermelon",
            "Ice Cold Lemonade",
            "Veggie Burgers",
            "Grilled Portobello Mushrooms",
            "Potato Salad",
            "Baked Beans"
          ],
          imageUrl: null
        });

      } finally {
        setLoading(false);
      }
    };

    if (cookoutId) fetchCookoutDetails();
  }, [cookoutId]);

    if (loading) {
      return (
        <div className="cookout-detail-container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading cookout details...</p>
          </div>
        </div>
      );
    }


    if (error && !cookout) {
      return (
        <div className="cookout-detail-container">
          <div className="error-message">
            <h2>Unable to Load Cookout</h2>
            <p>{error}</p>
            <button onClick={onBack} className="btn-primary">
              Back to List
            </button>
          </div>
        </div>
      );
    }


    return (
      <div className="cookout-detail-container">


        <div className="detail-header">
          <button onClick={onBack} className="back-button">
            Back to Cookouts
          </button>
        </div>


        {error && (
          <div className="error-banner">
            Warning: {error} (Showing sample data)
          </div>
        )}


        <div className="cookout-detail-content">

          {/* OPTIONAL PHOTO IN HERO SECTION */}

/*
<div className="hero-section">
  {cookout.imageUrl && (
    <img src={cookout.imageUrl} alt={cookout.title} className="cookout-image" />
  )}
  <div className="hero-info">
    <h1>{cookout.title}</h1>
    <div className="key-details">
      <div className="detail-item">
        <span className="icon">Date</span>
        <div>
          <strong>Date & Time</strong>
          <p>{cookout.date}</p>
          <p>{cookout.time}</p>
        </div>
      </div>
      <div className="detail-item">
        <span className="icon">Location</span>
        <div>
          <strong>Location</strong>
          <p>{cookout.location}</p>
          {cookout.address && <p className="address">{cookout.address}</p>}
        </div>
      </div>
      <div className="detail-item">
        <span className="icon">Guests</span>
        <div>
          <strong>Attendance</strong>
          <p>{cookout.attendees} people attending</p>
          {cookout.maxAttendees && (
            <p>Maximum: {cookout.maxAttendees} people</p>
          )}
        </div>
      </div>
    </div>
  </div>
</div>


<div className="section">
  <h2>Event Description</h2>
  <p className="description">{cookout.description}</p>
</div>


<div className="two-column-layout">


  <div className="left-column">


    <div className="section">
      <h2>Menu</h2>
      <div className="menu-grid">
        {cookout.menu.map((item, index) => (
          <div key={index} className="menu-item">
            {item}
          </div>
        ))}
      </div>
    </div>
  </div>


  <div className="right-column">

    <div className="section">
      <h2>Host Information</h2>
      <div className="host-info">
        <h3>{cookout.host}</h3>
        {cookout.hostEmail && (
          <p className="contact-info">
            Email: <a href={`mailto:${cookout.hostEmail}`}>{cookout.hostEmail}</a>
          </p>
        )}
      </div>
    </div>
  </div>
</div>


<div className="action-buttons">
  <button onClick={onBack} className="btn-secondary">
    Back to All Cookouts
  </button>
</div>
</div>
</div>
);
}
*/

