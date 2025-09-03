package com.techelevator.model;

public class MenuItem {

    private int menuItemId;

    private String menuItemName;

    private String itemDescription;

    public int getMenuItemId() {
        return menuItemId;
    }

    public void setMenuItemId(int menuItemId) {
        this.menuItemId = menuItemId;
    }

    public String getMenuItemName() {
        return menuItemName;
    }

    public void setMenuItemName(String menuItemName) {
        this.menuItemName = menuItemName;
    }

    public String getItemDescription() {
        return itemDescription;
    }

    public void setItemDescription(String itemDescription) {
        this.itemDescription = itemDescription;
    }

    public MenuItem() {

    }

    public MenuItem(int menuItemId, String menuItemName, String itemDescription) {
        this.menuItemId = menuItemId;
        this.menuItemName = menuItemName;
        this.itemDescription = itemDescription;
    }
}


