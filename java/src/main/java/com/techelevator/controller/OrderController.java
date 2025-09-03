package com.techelevator.controller;


import com.techelevator.dao.CookoutDao;
import com.techelevator.dao.OrderDao;
import com.techelevator.exception.DaoException;
import com.techelevator.model.Cookout;
import com.techelevator.model.MenuItem;
import com.techelevator.model.Order;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin
@PreAuthorize("isAuthenticated()")
@RequestMapping( path = "/orders")
public class OrderController {

    private OrderDao orderDao;

    public OrderController(OrderDao orderDao) {
        this.orderDao = orderDao;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @RequestMapping(method = RequestMethod.GET)
    public List<Order> getAllOrders() {
        List<Order> orders = new ArrayList<>();

        try {
            orders = orderDao.getOrders();
        }  catch (DaoException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }

        return orders;
    }
    @RequestMapping( path = "/{orderId}", method = RequestMethod.GET)
    Order getOrderById(@PathVariable int orderId) {
        Order order;

        try {
            order = orderDao.getOrderById(orderId);
        }  catch (DaoException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
        return order;
    }
    @RequestMapping( path = "/{attendeeId}?cookout_id=?", method = RequestMethod.GET)
    List<Order> getOrderByAttendeeIdCookoutId(@PathVariable int attendeeId, @RequestParam int cookoutId) {
        List<Order> orders = new ArrayList<>();

        try {
            orders = orderDao.getOrdersByAttendeeIdCookoutId(attendeeId, cookoutId);
        }  catch (DaoException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
        return orders;

    }
//    @RequestMapping( path = "/menu/{menuId}", method = RequestMethod.GET)
//    Order getOrderByMenuId(@PathVariable int menuId) {
//        Order order = null;
//
//        try {
//            order = orderDao.getOrderByMenuId(menuId);
//        }  catch (DaoException e) {
//            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
//        }
//        return order;
//    }
//    @RequestMapping( path = "/{menuItemId}", method = RequestMethod.GET)
//    MenuItem getMenuItemById(@PathVariable int menuItemId) {
//        MenuItem menuItem = null;
//        try {
//            menuItem = orderDao.getMenuItemById(menuItemId);
//        }  catch (DaoException e) {
//            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
//        }
//        return menuItem;
//    }

    @RequestMapping( path = "/all/{cookoutId}", method = RequestMethod.GET)
    List<Order> getOrdersByCookoutId(@PathVariable int cookoutId) {
        List<Order> orders;

        try {
            orders = orderDao.getOrdersByCookoutId(cookoutId);
        }  catch (DaoException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
        return orders;
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping()
    public void createOrder(@Valid @RequestBody Order order) {


        try {
            orderDao.createOrder(order);
        } catch (DaoException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }
    @PutMapping(path = "/{orderId}")
    Order updateOrder(@Valid @RequestBody Order order, @PathVariable int orderId) {
        Order updatedOrder = null;

        try {
            updatedOrder = orderDao.updateOrder(order, orderId);
        } catch (DaoException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }

        return updatedOrder;
    }
    @RequestMapping( path = "/{orderId}", method = RequestMethod.DELETE)
    void deleteOrderById(@PathVariable int orderId) {
        try {
            orderDao.deleteOrderById(orderId);
        } catch (DaoException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }
//    @RequestMapping( path = "/menu/{menuId}", method = RequestMethod.DELETE)
//    void deleteOrderByMenuId(@PathVariable int menuId) {
//        try {
//            orderDao.deleteOrderByMenuId(menuId);
//        } catch (DaoException e) {
//            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
//        }
//    }
//    @RequestMapping( path = "/{cookoutId}", method = RequestMethod.DELETE)
//    void deleteOrderByCookoutId(@PathVariable int cookoutId) {
//        try {
//            orderDao.deleteOrderById(cookoutId);
//        } catch (DaoException e) {
//            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
//        }
    }



