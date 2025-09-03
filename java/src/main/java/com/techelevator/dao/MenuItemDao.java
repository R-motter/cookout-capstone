package com.techelevator.dao;

import com.techelevator.model.MenuItem;
import java.util.List;

public interface MenuItemDao {

    List<MenuItem> getAllMenuItems();

    MenuItem getById(int menuItemId);

    MenuItem createMenuItem(MenuItem newItem);

}
