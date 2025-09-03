package com.techelevator.model;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class Order {

    private int orderId;

    private int menuItemId;

    private int attendeeId;

    private int cookoutId;

    private int quantity;

    private boolean completedOrder;

    public int getOrderId() {
        return orderId;
    }

    public void setOrderId(int orderId) {
        this.orderId = orderId;
    }

    public int getMenuItemId() {
        return menuItemId;
    }

    public void setMenuItemId(int menuItemId) {
        this.menuItemId = menuItemId;
    }

    public int getAttendeeId() {
        return attendeeId;
    }

    public void setAttendeeId(int attendeeId) {
        this.attendeeId = attendeeId;
    }

    public int getCookoutId() {
        return cookoutId;
    }

    public void setCookoutId(int cookoutId) {
        this.cookoutId = cookoutId;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public boolean isCompletedOrder() {
        return completedOrder;
    }

    public void setCompletedOrder(boolean completedOrder) {
        this.completedOrder = completedOrder;
    }

    public Order() {

    }

    public Order(int orderId, int menuItemId, int attendeeId, int cookoutId, int quantity, boolean completedOrder) {
        this.orderId = orderId;
        this.menuItemId = menuItemId;
        this.attendeeId = attendeeId;
        this.cookoutId = cookoutId;
        this.quantity = quantity;
        this.completedOrder = completedOrder;
    }
}
