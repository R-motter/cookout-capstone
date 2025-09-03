package com.techelevator.dao;

import com.techelevator.model.Cookout;

import java.util.List;
import java.util.Map;

public interface CookoutDao {

    List<Cookout> getCookouts();

    Cookout getCookoutById(int cookoutId);

    List<Cookout> getCookoutsByHostUsername(String username);

    Cookout createCookout(Cookout cookout, String username);

    int deleteCookoutById(int cookoutId);

    Cookout updateCookout(Cookout cookout, int cookoutId);

    Map<String, List<Cookout>> getCookoutByUserId(int userId);


}
