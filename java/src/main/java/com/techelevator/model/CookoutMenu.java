package com.techelevator.model;

public class CookoutMenu {

    private int cookoutId;
    private int menuItemId;

    public int getCookoutId() {
        return cookoutId;
    }

    public void setCookoutId(int cookoutId) {
        this.cookoutId = cookoutId;
    }

    public int getMenuItemId() {
        return menuItemId;
    }

    public void setMenuItemId(int menuItemId) {
        this.menuItemId = menuItemId;
    }

    public CookoutMenu() { }

    public CookoutMenu(int cookoutId, int menuItemId){
        this.cookoutId = cookoutId;
        this.menuItemId = menuItemId;
    }
}
