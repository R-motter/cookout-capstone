import { useState, useEffect } from "react";
import UserService from "../../services/UserService";
import CookoutService from "../../services/CookoutService";
import CookoutMenuService from "../../services/CookoutMenuService";
import MenuItemService from "../../services/MenuItemService";
import OrderService from "../../services/OrderService";
import Modal from "../../components/Modal/Modal";

export default function ChefView() {

    const [allCookouts, setAllCookouts] = useState([]);
    const [chefCookouts, setChefCookouts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userId, setUserId] = useState();
    const [selectedCookout, setSelectedCookout] = useState();
    const [cookoutMenuItems, setCookoutMenuItems] = useState([]);
    const [cookoutMenu, setCookoutMenu] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState();
    const [orders, setOrders] = useState([]);
    const [orderItemNames, setOrderItemNames] = useState({});



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

                //setOrderItemNames(orders.data.menuItemName);
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

        async function fetchData() {
            setIsLoading(true);
            try {
                const userResponse = await UserService.getIdByUser();
                setUserId(userResponse.data);

                const cookoutResponse = await CookoutService.getCookoutsByUserIdForViewCookouts(userResponse.data);
                setAllCookouts(cookoutResponse.data);

                //setAttendingCookouts(cookoutResponse.data.attending);
                //setHostingCookouts(cookoutResponse.data.hosting);
                setChefCookouts(cookoutResponse.data.chef);

            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [])
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

    return (
        <>
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
                            <button onClick={() => handleOrderClick(cookout)}>View Orders</button>
                        </div>
                    ))
                )
            }
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <>
                    <h3>Orders</h3>

                    {
                        orders.length > 0 ?
                            (isLoading ? <p>loading...</p> : (
                                <>
                            
                                    <h2>Orders: </h2>
                                    {orders.map((order, index) => {
                                        const item = orderItemNames[order.menuItemId];
                                        
                                        if (!item) {
                                            return <p key={index}>Loading item details...</p>;
                                        }

                                        { if(order.completedOrder === false) {
                                            return (
                                                
                                        <div key={index}>
                                            
                                            <>
                                            <h4>Item</h4>
                                            
                                            <p>{item.menuItemName}</p>
                                            <button onClick={() => { handleOrderFinish(order, order.orderId) }}>Finish Order</button>
                                            </>
                                        </div>)} else {
                                            <>
                                            <h4>Item</h4>

                                            <p>{item.menuItemName}</p>
                                            <p>All Done!</p>
                                            </>
                                        }}

                                    })}


                                </>
                            ))
                            : <p>No Orders Yet!</p>}
                </>
            </Modal>

        </>
    )
}


/*<Modal isOpen={isModalOpen} onClose={handleCloseModal}>
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
              
              
              const handleOpenModal = (cookout) => {
    setSelectedCookout(cookout);
    setIsModalOpen(true);
    setLoading(true);
    /*async function fetchMenu() {
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
        setLoading(false)
    }
  }
  fetchMenu();
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

          if(!(menuItemData.length > 0) && (cookout.hostId === userId)) {
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
              */