package com.techelevator.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;
import java.time.LocalTime;

public class Cookout {


    private int cookoutId;


    private int hostId;


    private int chefId;


    private String cookoutName;


    private String cookoutLocation;


    private LocalDate cookoutDate;


    private LocalTime cookoutTime;


    public String chefUsername;

    public String getChefUsername() {
        return chefUsername;
    }

    public void setChefUsername(String chefUsername) {
        this.chefUsername = chefUsername;
    }

    public int getId() {
        return cookoutId;
    }

    public void setId(int cookoutId) {
        this.cookoutId = cookoutId;
    }

    public int getHostId() {
        return hostId;
    }

    public void setHostId(int hostId) {
        this.hostId = hostId;
    }

    public int getChefId() {
        return chefId;
    }

    public void setChefId(int chefId) {
        this.chefId = chefId;
    }

    public String getCookoutName() {
        return cookoutName;
    }

    public void setCookoutName(String cookoutName) {
        this.cookoutName = cookoutName;
    }

    public String getCookoutLocation() {
        return cookoutLocation;
    }

    public void setCookoutLocation(String cookoutLocation) {
        this.cookoutLocation = cookoutLocation;
    }

    public LocalDate getCookoutDate() {
        return cookoutDate;
    }

    public void setCookoutDate(LocalDate cookoutDate) {
        this.cookoutDate = cookoutDate;
    }

    public LocalTime getCookoutTime() {
        return cookoutTime;
    }

    public void setCookoutTime(LocalTime cookoutTime) {
        this.cookoutTime = cookoutTime;
    }

    public Cookout() {

    }

    public Cookout(int id, int hostId, int chefId, String cookoutName, String cookoutLocation, LocalDate cookoutDate, LocalTime cookoutTime) {
        this.cookoutId = cookoutId;
        this.hostId = hostId;
        this.chefId = chefId;
        this.cookoutName = cookoutName;
        this.cookoutLocation = cookoutLocation;
        this.cookoutDate = cookoutDate;
        this.cookoutTime = cookoutTime;
    }
}
