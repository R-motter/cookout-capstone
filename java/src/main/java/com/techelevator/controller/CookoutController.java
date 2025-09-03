package com.techelevator.controller;

import com.techelevator.dao.CookoutDao;
import com.techelevator.exception.DaoException;
import com.techelevator.model.Cookout;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin
@PreAuthorize("isAuthenticated()")
@RequestMapping ( path = "/cookouts")
public class CookoutController {

    private CookoutDao cookoutDao;

    public CookoutController(CookoutDao cookoutDao) {
        this.cookoutDao = cookoutDao;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @RequestMapping(method = RequestMethod.GET)
    public List<Cookout> getAllCookouts() {
        List<Cookout> cookouts = new ArrayList<>();

        try {
            cookouts = cookoutDao.getCookouts();
        }  catch (DaoException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }

        return cookouts;
    }


    @GetMapping(path = "/{cookoutId}")
    public Cookout getByCookoutId(@PathVariable int cookoutId) {
        Cookout cookout = null;

        try {
            cookout = cookoutDao.getCookoutById(cookoutId);
        }  catch (DaoException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }

        return cookout;
    }

    @GetMapping(path = "/hosts")
    public List<Cookout> getByHostId(Principal principal) {
        List<Cookout> cookouts = new ArrayList<>();
//update this to be List<Cookout>
        try {
            cookouts = cookoutDao.getCookoutsByHostUsername(principal.getName());
        }  catch (DaoException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
        return cookouts;
        //No modifications were made to the functional/active code
    }

    @GetMapping(path = "/user/{userId}")
    public Map<String, List<Cookout>> getCookoutByUserId(@PathVariable int userId) {
        Map<String, List<Cookout>> result = new HashMap<>();

        try {
            return cookoutDao.getCookoutByUserId(userId);
        } catch (DaoException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }

    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping()
    public Cookout createCookout(@Valid @RequestBody Cookout newCookout, Principal principal) {
        try {

          return cookoutDao.createCookout(newCookout, principal.getName());
        } catch (DaoException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }

    @PutMapping(path = "/{cookoutId}")
    public Cookout updateCookout(@Valid @RequestBody Cookout cookout, @PathVariable int cookoutId) {
        Cookout updatedCookout = null;

        try {

            updatedCookout = cookoutDao.updateCookout(cookout, cookoutId);
        } catch (DaoException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
        return updatedCookout;
    }

}
