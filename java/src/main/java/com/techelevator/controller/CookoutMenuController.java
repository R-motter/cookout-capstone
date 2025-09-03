package com.techelevator.controller;

import com.techelevator.dao.CookoutMenuDao;
import com.techelevator.exception.DaoException;
import com.techelevator.model.CookoutMenu;
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
@RequestMapping(path = "/CookoutMenu")
public class CookoutMenuController {

    private CookoutMenuDao CookoutMenuDao;

    public CookoutMenuController(CookoutMenuDao CookoutMenuDao) {
        this.CookoutMenuDao = CookoutMenuDao;
    }

    @RequestMapping(method = RequestMethod.GET)
    List<CookoutMenu> getAllCookoutMenus(){
        List<CookoutMenu> allCookoutMenus = new ArrayList<>();

        try {
            allCookoutMenus = CookoutMenuDao.getAllCookoutMenus();
        } catch (DaoException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }

        return allCookoutMenus;
    }

    @GetMapping(path = "/{cookoutId}")
    List<CookoutMenu> getCookoutMenuById(@PathVariable int cookoutId){
        List<CookoutMenu> cookoutMenu = new ArrayList<>();

        try {
            cookoutMenu = CookoutMenuDao.getCookoutMenuById(cookoutId);
        }catch (DaoException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }

        return cookoutMenu;
    }

    @GetMapping(path = "/item/{itemId}")
    CookoutMenu getCookoutMenuByItemId(@PathVariable int itemId){
        CookoutMenu cookoutMenu;

        try {
            cookoutMenu = CookoutMenuDao.getCookoutMenuByItemId(itemId);
        }catch (DaoException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }

        return cookoutMenu;
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping()
    CookoutMenu createCookoutMenu(@Valid @RequestBody CookoutMenu cookoutMenu){
        try {
            CookoutMenuDao.createCookoutMenu(cookoutMenu);
        }catch (DaoException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }

        return cookoutMenu;
    }

    @PutMapping(path = "/{cookoutId}")
    CookoutMenu updateCookoutMenu(@Valid @RequestBody CookoutMenu cookoutMenu,@PathVariable int cookoutMenuId){
        CookoutMenu updatedCookoutMenu = new CookoutMenu();

        try {
            updatedCookoutMenu = CookoutMenuDao.updateCookoutMenu(cookoutMenu, cookoutMenuId);
        } catch (DaoException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }

        return updatedCookoutMenu;
    }

    @DeleteMapping(path = "/{cookoutId}/{menuItemId}")
    int deleteCookoutMenu(@PathVariable int cookoutId, @PathVariable int menuItemId){
        int affectedRows = 0;

        try {
            affectedRows = CookoutMenuDao.deleteCookoutMenu(cookoutId, menuItemId);
        }catch (DaoException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }

        return affectedRows;
    }
}

