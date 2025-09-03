package com.techelevator.dao;

import com.techelevator.model.Cookout;
import com.techelevator.model.CookoutMenu;

import java.text.CollationKey;
import java.util.List;

public interface CookoutMenuDao {

    List<CookoutMenu> getAllCookoutMenus();

    List<CookoutMenu> getCookoutMenuById(int cookoutId);

    CookoutMenu getCookoutMenuByCookoutIdItemId(int cookoutId, int menuItemId);

    CookoutMenu getCookoutMenuByItemId(int itemId);

    CookoutMenu createCookoutMenu(CookoutMenu cookoutMenu);

    CookoutMenu updateCookoutMenu(CookoutMenu cookoutMenu, int cookoutMenuId);

    int deleteCookoutMenu(int cookoutId, int menuItemId);

}
