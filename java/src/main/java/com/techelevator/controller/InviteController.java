package com.techelevator.controller;

import com.techelevator.dao.InviteDao;
import com.techelevator.exception.DaoException;
import com.techelevator.model.Invite;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.List;

@RestController
@CrossOrigin
//        (origins = "http://localhost:5173",
//        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE, RequestMethod.OPTIONS},
//        allowedHeaders = {"Authorization", "Content-Type"},
//        allowCredentials = "true")
@PreAuthorize("isAuthenticated()")
@RequestMapping(path = "/invite")
public class InviteController {

    private InviteDao inviteDao;

    public InviteController(InviteDao inviteDao) {
        this.inviteDao = inviteDao;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @RequestMapping(method = RequestMethod.GET)
    public List<Invite> getAllInvites() {
        List<Invite> invites;

        try {
            invites = inviteDao.getInvites();
        } catch (DaoException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }

        return invites;
    }

    @GetMapping(path = "/{inviteId}")
    public Invite getByInviteId(@PathVariable int inviteId) {
        Invite invite;

        try {
            invite = inviteDao.getInviteById(inviteId);
        } catch (DaoException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }

        return invite;
    }

    @GetMapping(path = "/attendee/{attendeeId}")
    public List<Invite> getAllInvitesByAttendeeId(@PathVariable int attendeeId) {
        List<Invite> invites;

        try {
            invites = inviteDao.getInvitesByAttendeeId(attendeeId);
        } catch (DaoException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }

        return invites;
    }

    @GetMapping(path = "/user")
    public List<Invite> getInvitesByUser(Principal principal) {
        List<Invite> invites;

        try {
            invites = inviteDao.getInvitesByUsername(principal.getName());
        } catch (DaoException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }

        return invites;
    }


    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping()
    public Invite createNewInvite(@Valid @RequestBody Invite newInvite, String attendeeUsername) {
        try {
            newInvite =  inviteDao.createInvite(newInvite, attendeeUsername);
        } catch (DaoException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }

        return newInvite;
    }

    @PutMapping(path = "/{inviteId}")
    public Invite updateInvite(@Valid @RequestBody Invite invite, @PathVariable int inviteId) {
        Invite updatedInvite;
        try {
            updatedInvite = inviteDao.updateInvite(invite, inviteId);
        } catch (DaoException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }

        return updatedInvite;
    }

    @GetMapping(path = "/cookout/{cookoutId}")
    public List<Invite> getInvitesByCookout(@PathVariable int cookoutId) {
        try {
            return inviteDao.getInvitesByCookout(cookoutId);
        } catch (DaoException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }

    @DeleteMapping("/invites")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteInviteByCookoutIdAndUsername(@RequestParam int cookoutId, @RequestParam String username) {
        inviteDao.deleteInviteByCookoutIdAndUsername(cookoutId, username);
    }
}


