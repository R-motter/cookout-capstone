package com.techelevator.model;

public class Menu {

    private int menuId;
    private int cookoutId;

    public int getMenuId() {
        return menuId;
    }

    public void setMenuId(int menuId) {
        this.menuId = menuId;
    }

    public int getCookoutId() {
        return cookoutId;
    }

    public void setCookoutId(int cookoutId) {
        this.cookoutId = cookoutId;
    }

    public Menu(){ }

    public Menu(int menuId, int cookoutId){
        this.menuId = menuId;
        this.cookoutId = cookoutId;
    }
}
