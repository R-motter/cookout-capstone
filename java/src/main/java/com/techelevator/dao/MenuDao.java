package com.techelevator.dao;

import com.techelevator.model.Menu;
import com.techelevator.model.MenuItem;
import com.techelevator.model.RegisterUserDto;
import java.util.List;

public interface MenuDao {

    List<Menu> getMenus();

    Menu getMenuById(int menuId);

    Menu updateMenu(Menu Menu, int cookoutId);

    Menu createMenu(Menu menu);

    void deleteMenuById(int id);

}
