package com.techelevator.dao;

import com.techelevator.exception.DaoException;
import com.techelevator.model.*;
import org.springframework.jdbc.CannotGetJdbcConnectionException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Component
public class JdbcOrderDao implements OrderDao {
    private final JdbcTemplate jdbcTemplate;

    public JdbcOrderDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<Order> getOrders() {
        List<Order> orders = new ArrayList<>();
        String sql = "SELECT * FROM orders;";
        try {
            SqlRowSet results = jdbcTemplate.queryForRowSet(sql);
            while (results.next()) {
                Order order = mapRowToOrder(results);
                orders.add(order);
            }
        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        }
        return orders;

    }

    @Override
    public Order getOrderById(int orderId) {
        Order order = null;
        String sql = "SELECT * FROM orders WHERE order_id = ?;";
        try {
            SqlRowSet result = jdbcTemplate.queryForRowSet(sql, orderId);
            if (result.next()) {
                order = mapRowToOrder(result);
            }
        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        }

        return order;
    }

    @Override
    public List<Order> getOrdersByAttendeeIdCookoutId(int attendeeId, int cookoutId) {
        List<Order> orders = new ArrayList<>();
        String sql = "SELECT * FROM orders WHERE attendee_id = ? AND cookout_id = ?;";
        try {
            SqlRowSet result = jdbcTemplate.queryForRowSet(sql, attendeeId, cookoutId);
            while (result.next()) {
                orders.add(mapRowToOrder(result));
            }
        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        }

        return orders;
    }

//    @Override
//    public Order getOrderByMenuId(int menuId) {
//        Order order = null;
//        String sql = "SELECT * FROM orders JOIN menu ON orders.cookout_id = menu.cookout_id WHERE menu_id = ?;";
//        try {
//
//            SqlRowSet result = jdbcTemplate.queryForRowSet(sql, menuId);
//            if (result.next()) {
//                order = mapRowToOrder(result);
//            }
//        } catch (CannotGetJdbcConnectionException e) {
//            throw new DaoException("Unable to connect to server or database", e);
//        }
//        return order;
//    }
//
//    @Override
//    public MenuItem getMenuItemById(int menuItemId) {
//        Order order = null;
//        MenuItem menuItem = new MenuItem();
//        String sql = "SELECT * FROM menu_item WHERE menu_item_id = ?;";
//        try {
//
//            SqlRowSet result = jdbcTemplate.queryForRowSet(sql, menuItemId);
//            if (result.next()) {
//                order = mapRowToOrder(result);
//            }
//        } catch (CannotGetJdbcConnectionException e) {
//            throw new DaoException("Unable to connect to server or database", e);
//        }
//        return menuItem;
//    }

    @Override
    public List<Order> getOrdersByCookoutId(int cookoutId) {
        List<Order> orders = new ArrayList<>();
        String sql = "SELECT * FROM orders WHERE cookout_id = ?;";
        try {
            SqlRowSet result = jdbcTemplate.queryForRowSet(sql, cookoutId);
            while (result.next()) {
                orders.add(mapRowToOrder(result));
            }
        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        }
        return orders;
    }

    @Override
    public Order createOrder(Order order) {
        Order newOrder = null;
        String sql = "INSERT INTO orders (menu_item_id, attendee_id, cookout_id, quantity, completed_order)" +
                "VALUES (?, ?, ?, ?, ?) RETURNING order_id;";
        try {
            int newOrderId = jdbcTemplate.queryForObject(sql, int.class, order.getMenuItemId(), order.getAttendeeId(),
                    order.getCookoutId(), order.getQuantity(), order.isCompletedOrder());
            newOrder = getOrderById(newOrderId);
        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        }

        return newOrder;
    }

    @Override

    public int deleteOrderById(int orderId) {
        int affectedRowCount = 0;
        String sql = "DELETE FROM orders WHERE order_id = ?;";
        try {
            affectedRowCount = jdbcTemplate.update(sql, orderId);
        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        }
        return affectedRowCount;
    }

//    @Override
//    public void deleteOrderByMenuId(int menuId) {
//        int affectedRowCount = 0;
//        String sql = "DELETE FROM orders JOIN menu ON orders.cookout_id = menu.cookout_id WHERE menu_id = ?;";
//        try {
//            affectedRowCount = jdbcTemplate.update(sql, menuId);
//        } catch (CannotGetJdbcConnectionException e) {
//            throw new DaoException("Unable to connect to server or database", e);
//        }
//
//    }
//
//    @Override
//    public void deleteOrderByCookoutId(int cookoutId) {
//        int affectedRowCount = 0;
//        String sql = "DELETE FROM orders WHERE cookout_id = ?;";
//        try {
//            affectedRowCount = jdbcTemplate.update(sql, cookoutId);
//        } catch (CannotGetJdbcConnectionException e) {
//            throw new DaoException("Unable to connect to server or database", e);
//        }


    @Override
    public Order updateOrder(Order order, int orderId) {
        Order updatedOrder;
        String sql = "UPDATE orders SET menu_item_id = ?, attendee_id = ?, cookout_id = ?, quantity = ?, " +
                "completed_order = ? WHERE order_id = ?;";
        try {
            if (order.getOrderId() != orderId) {
                return null;
            } else {
                jdbcTemplate.update(sql, order.getMenuItemId(), order.getAttendeeId(), order.getCookoutId(),
                        order.getQuantity(), order.isCompletedOrder(), order.getOrderId());
            }

                updatedOrder = getOrderById(order.getOrderId());


        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        }


        return updatedOrder;
    }


    private Order mapRowToOrder(SqlRowSet rs) {
        Order order = new Order();
        order.setOrderId(rs.getInt("order_id"));
        order.setMenuItemId(rs.getInt("menu_item_id"));
        order.setAttendeeId(rs.getInt("attendee_id"));
        order.setCookoutId(rs.getInt("cookout_id"));
        order.setQuantity(rs.getInt("quantity"));
        //order.setValidOrderDate(rs.getDate("order_time").toLocalDate());
        order.setCompletedOrder(rs.getBoolean("completed_order"));
        return order;
    }
}