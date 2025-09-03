package com.techelevator.dao;

import com.techelevator.model.*;

import java.time.LocalDate;
import java.util.List;

public interface OrderDao {

    List<Order> getOrders();
    Order getOrderById(int orderId);

    List<Order> getOrdersByAttendeeIdCookoutId(int attendeeId, int cookoutId);
    //Order getOrderByMenuId(int menuId);
    //MenuItem getMenuItemById(int menuItemId);

    List<Order> getOrdersByCookoutId(int cookoutId);

    Order createOrder(Order order);

    int deleteOrderById(int orderId);
    //void deleteOrderByMenuId(int menuId);
    //void deleteOrderByCookoutId(int cookoutId);

    Order updateOrder(Order order, int orderId);
}
