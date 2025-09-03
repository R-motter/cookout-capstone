package com.techelevator.controller;

import com.techelevator.dao.MenuDao;
import com.techelevator.exception.DaoException;
import com.techelevator.model.Menu;
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
@RequestMapping( path = "/menu")
public class MenuController {

    private MenuDao menuDao;

    public MenuController(MenuDao menuDao){
        this.menuDao = menuDao;
    }


    @RequestMapping(method = RequestMethod.GET)
    public List<Menu> getAllMenus() {
        List<Menu> allMenus = new ArrayList<>();

        try {
            allMenus = menuDao.getMenus();
        } catch (DaoException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }

        return allMenus;
    }

    @GetMapping(path = "/{menuId}")
    public Menu getMenuById(@PathVariable int menuId){
        Menu menu = null;
        try {
            menu = menuDao.getMenuById(menuId);
        } catch (DaoException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }

        return menu;
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping()
    public void createMenu(@Valid @RequestBody Menu newMenu){
        try {
            menuDao.createMenu(newMenu);
        } catch (DaoException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }


    @PutMapping(path = "/{menuId}")
    public Menu updateMenu(@Valid @RequestBody Menu menu,@PathVariable int menuId){
        Menu updatedMenu = null;

        try {
           updatedMenu = menuDao.updateMenu(menu, menuId);
        } catch (DaoException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
        return updatedMenu;
    }


    @RequestMapping(path = "/{id}",
    method = RequestMethod.DELETE)
    public void deleteMenu(@PathVariable int id) {
        menuDao.deleteMenuById(id);

    }
}
