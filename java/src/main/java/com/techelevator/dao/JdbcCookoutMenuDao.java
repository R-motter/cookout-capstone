package com.techelevator.dao;

import com.techelevator.exception.DaoException;
import com.techelevator.model.Cookout;
import com.techelevator.model.CookoutMenu;
import org.springframework.jdbc.CannotGetJdbcConnectionException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Repository
@Component
public class JdbcCookoutMenuDao implements CookoutMenuDao{

    private final JdbcTemplate jdbcTemplate;

    public JdbcCookoutMenuDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<CookoutMenu> getAllCookoutMenus() {
        List<CookoutMenu> allCookoutMenus = new ArrayList<>();

        String sql = "SELECT * FROM cookout_menu";

        try {
            SqlRowSet results = jdbcTemplate.queryForRowSet(sql);
            while(results.next()){
                CookoutMenu result = mapRowToCookoutMenu(results);
                allCookoutMenus.add(result);
            }
        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        }

        return allCookoutMenus;
    }

    @Override
    public List<CookoutMenu> getCookoutMenuById(int cookoutMenuId) {
        List<CookoutMenu> cookoutMenu = new ArrayList<>();

        String sql = "SELECT * FROM cookout_menu WHERE cookout_id = ?";

        try {
            SqlRowSet results = jdbcTemplate.queryForRowSet(sql, cookoutMenuId);
            while (results.next()){
                cookoutMenu.add(mapRowToCookoutMenu(results));
            }
        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        }

        return cookoutMenu;
    }

    @Override
    public CookoutMenu getCookoutMenuByCookoutIdItemId(int cookoutId, int menuItemId) {
        CookoutMenu cookoutMenu = new CookoutMenu();

        String sql = "SELECT * FROM cookout_menu WHERE cookout_id = ? AND menu_item_id = ?;";

        try {
            SqlRowSet results = jdbcTemplate.queryForRowSet(sql, cookoutId, menuItemId);
            if (results.next()){
                cookoutMenu = mapRowToCookoutMenu(results);
            }
        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        }

        return cookoutMenu;
    }

    @Override
    public CookoutMenu getCookoutMenuByItemId(int itemId) {
        CookoutMenu cookoutMenu = new CookoutMenu();

        String sql = "SELECT * FROM cookout_menu WHERE menu_item_id = ?";

        try {
            SqlRowSet results = jdbcTemplate.queryForRowSet(sql, itemId);
            if (results.next()){
                cookoutMenu = mapRowToCookoutMenu(results);
            }
        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        }

        return cookoutMenu;
    }

    @Override
    public CookoutMenu createCookoutMenu(CookoutMenu cookoutMenu) {
        CookoutMenu newCookoutMenu = new CookoutMenu();

        String sql = "INSERT INTO cookout_menu (cookout_id, menu_item_id) VALUES (?, ?) RETURNING cookout_id;";

        try {
            int cookoutId = jdbcTemplate.queryForObject(sql, int.class, cookoutMenu.getCookoutId(), cookoutMenu.getMenuItemId());
            newCookoutMenu = getCookoutMenuByCookoutIdItemId(cookoutId, cookoutMenu.getMenuItemId());
        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        }

        return newCookoutMenu;
    }

    @Override
    public CookoutMenu updateCookoutMenu(CookoutMenu cookoutMenu, int cookoutMenuId) {
        CookoutMenu updatedCookoutMenu = new CookoutMenu();
        int affectedRowCount = 0;
        String sql = "UPDATE cookout_menu SET cookout_id = ?, menu_item_id = ? WHERE cookout_id = ?";

        try {
            if (cookoutMenu.getCookoutId() != cookoutMenuId){
                return null;
            } else {
                affectedRowCount = jdbcTemplate.update(sql, cookoutMenu.getCookoutId(), cookoutMenu.getMenuItemId(), cookoutMenu);
            }

            if (affectedRowCount == 0){
                throw new DaoException("zero rows affected, expected update not performed.");
            } else {
                updatedCookoutMenu = getCookoutMenuByCookoutIdItemId(cookoutMenu.getCookoutId(), cookoutMenu.getMenuItemId());
            }

        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        }

        return updatedCookoutMenu;
    }

    @Override
    public int deleteCookoutMenu(int cookoutId, int menuItemId) {
        int affectedRows = 0;

        String sql = "DELETE FROM cookout_menu WHERE cookout_id = ? AND menu_item_id = ?;";

        try {
            affectedRows = jdbcTemplate.update(sql, cookoutId, menuItemId);
        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        }

        return affectedRows;
    }

    private CookoutMenu mapRowToCookoutMenu(SqlRowSet rs){

        CookoutMenu cookoutMenu = new CookoutMenu();
        cookoutMenu.setCookoutId(rs.getInt("cookout_id"));
        cookoutMenu.setMenuItemId(rs.getInt("menu_item_id"));
        return cookoutMenu;

    }

}
