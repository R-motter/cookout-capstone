package com.techelevator.controller;

import com.techelevator.dao.MenuDao;
import com.techelevator.dao.MenuItemDao;
import com.techelevator.exception.DaoException;
import com.techelevator.model.Menu;
import com.techelevator.model.MenuItem;
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
@RequestMapping( path = "/menuItem")
public class MenuItemController {

    private MenuItemDao menuItemDao;

    public MenuItemController(MenuItemDao menuItemDao){
        this.menuItemDao = menuItemDao;
    }


    @GetMapping()
    public List<MenuItem> getAllMenuItems() {
        List<MenuItem> menuItems = new ArrayList<>();

        try {
            menuItems = menuItemDao.getAllMenuItems();
        } catch (DaoException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }

        return menuItems;
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public MenuItem createNewMenuItem(@Valid @RequestBody MenuItem newMenuItem){
        try {
            return menuItemDao.createMenuItem(newMenuItem);
        } catch (DaoException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
        //return newMenuItem;
    }

    @GetMapping(path = "/{menuItemId}")
    public MenuItem getById(@PathVariable int menuItemId) {
        MenuItem menuItem = new MenuItem();

        try {
            menuItem = menuItemDao.getById(menuItemId);
        }  catch (DaoException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }

        return menuItem;
    }


//
//    @RequestMapping(method = RequestMethod.GET)
//    public List<MenuItem> getAllMenuItems(){
//        List<MenuItem> allMenus = new ArrayList<>();
//
//        try {
//            allMenus = menuItemDao.getMenuItems();
//        } catch (DaoException e) {
//            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
//        }
//
//        return allMenus;
//    }
//
//    @GetMapping(path = "/{menuItemId}")
//    public MenuItem getMenuItemById(@PathVariable int menuItemId){
//        MenuItem menuItem= null;
//        try {
//            menuItem = menuItemDao.getMenuItemById(menuItemId);
//        } catch (DaoException e) {
//            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
//        }
//
//        return menuItem;
//    }
//
//    @GetMapping(path = "/menu/{menuId}")
//    public List<MenuItem> getMenuItemsByMenuId(@PathVariable int menuId) {
//        List<MenuItem> menuItems;
//
//        try {
//            menuItems = menuItemDao.getAllMenuItemsByMenuId(menuId);
//        } catch (DaoException e) {
//            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
//        }
//
//        return menuItems;
//    }
//
//    @ResponseStatus(HttpStatus.CREATED)
//    @PostMapping
//    public MenuItem createNewMenuItem(@Valid @RequestBody MenuItem newMenuItem){
//        try {
//            menuItemDao.createMenuItem(newMenuItem);
//        } catch (DaoException e) {
//            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
//        }
//        return newMenuItem;
//    }
//
//    @RequestMapping(path = "/{menuItemId}", method = RequestMethod.PUT)
//    public  MenuItem updateMenuItem(@RequestBody MenuItem updatedMenuItem, @PathVariable int menuItemId){
//        try {
//            menuItemDao.updateMenuItem(updatedMenuItem);
//        } catch (DaoException e) {
//            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
//        }
//
//        return updatedMenuItem;
//    }
//
//    @RequestMapping(path = "/{id}", method = RequestMethod.DELETE)
//    public void deleteMenuItem(@RequestBody MenuItem menuItem, @PathVariable int menuItemId){
//        try {
//            menuItemDao.deleteMenuItem(menuItem);
//        } catch (DaoException e) {
//            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
//        }
//    }
}
