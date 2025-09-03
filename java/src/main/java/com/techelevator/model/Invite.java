package com.techelevator.model;


import java.util.List;
import java.util.Map;

public class Invite {

    private int inviteId;

    private int attendeeId;

    private int cookoutId;

    public void setAttendeeUsername(String attendeeUsername) {
        this.attendeeUsername = attendeeUsername;
    }

    public String attendeeUsername;


        public String getAttendeeUsername() {
        return attendeeUsername;
    }

    public void setChefUsername(String chefUsername) {
        this.attendeeUsername = chefUsername;
    }

    public int getInviteId() {
        return inviteId;
    }

    public void setInviteId(int inviteId) {
        this.inviteId = inviteId;
    }

    public int getAttendeeId() {
        return attendeeId;
    }

    public void setAttendeeId(int attendeeId) {
        this.attendeeId = attendeeId;
    }

    public int getCookoutId() {
        return cookoutId;
    }

    public void setCookoutId(int cookoutId) {
        this.cookoutId = cookoutId;
    }

    public Invite() {

    }

    public Invite(int inviteId, int attendeeId, int cookoutId) {
        this.inviteId = inviteId;
        this.attendeeId = attendeeId;
        this.cookoutId = cookoutId;
    }

}
