package com.techelevator.dao;

import java.util.ArrayList;
import java.util.List;

import com.techelevator.exception.DaoException;
import com.techelevator.model.MenuItem;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.CannotGetJdbcConnectionException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Component;

@Component
public class JdbcMenuItemDao implements MenuItemDao{

    private final JdbcTemplate jdbcTemplate;

    public JdbcMenuItemDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }


    @Override
    public List<MenuItem> getAllMenuItems() {
        List<MenuItem> menuItems = new ArrayList<>();
        String sql = "SELECT * FROM menu_item;";

        try {
            SqlRowSet results = jdbcTemplate.queryForRowSet(sql);
            while (results.next()) {
                menuItems.add(mapRowToMenuItem(results));
            }
        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        }

        return menuItems;
    }

    @Override
    public MenuItem createMenuItem(MenuItem newMenuItem){
        String sql = "INSERT INTO menu_item (menu_item_name, item_description) values (?, ?) RETURNING menu_item_id;";
        try {

            int newMenuItemId = jdbcTemplate.queryForObject(sql, int.class,
                    newMenuItem.getMenuItemName(), newMenuItem.getItemDescription());
            newMenuItem = getById(newMenuItemId);
        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        } catch (DataIntegrityViolationException e) {
            throw new DaoException("Data integrity violation", e);
        }
        return newMenuItem;
    }

    @Override
    public MenuItem getById(int menuItemId) {
        MenuItem menuItem = new MenuItem();

        String sql = "SELECT * FROM menu_item WHERE menu_item_id = ?;";

        try {
            SqlRowSet result = jdbcTemplate.queryForRowSet(sql, menuItemId);
            if (result.next()) {
                menuItem = mapRowToMenuItem(result);
            }
        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        }

        return menuItem;
    }



//    @Override
//    public List<MenuItem> getMenuItems(){
//        List<MenuItem> menuItems = new ArrayList<>();
//
//        String sql = "SELECT * FROM menu_item";
//
//        try {
//            SqlRowSet results = jdbcTemplate.queryForRowSet(sql);
//            while (results.next()) {
//                MenuItem menuItem = mapRowToMenuItem(results);
//                menuItems.add(menuItem);
//            }
//        } catch (CannotGetJdbcConnectionException e) {
//            throw new DaoException("Unable to connect to server or database", e);
//        }
//
//        return menuItems;
//    }
//
//    @Override
//    public MenuItem getMenuItemById(int menuItemId){
//        MenuItem menuItem = null;
//
//        String sql = "SELECT * FROM menu_item where menu_item_id = ?";
//
//        try {
//            SqlRowSet results = jdbcTemplate.queryForRowSet(sql, menuItemId);
//            if (results.next()) {
//                menuItem = mapRowToMenuItem(results);
//            }
//        } catch (CannotGetJdbcConnectionException e) {
//            throw new DaoException("Unable to connect to server or database", e);
//        }
//
//        return menuItem;
//    }
//
//    @Override
//    public List<MenuItem> getAllMenuItemsByMenuId(int menuId) {
//        List<MenuItem> menuItems = new ArrayList<>();
//
//        String sql = "SELECT * FROM menu_item WHERE menu_id = ?;";
//
//        try {
//            SqlRowSet results = jdbcTemplate.queryForRowSet(sql, menuId);
//            while(results.next()) {
//                menuItems.add(mapRowToMenuItem(results));
//            }
//
//        } catch (CannotGetJdbcConnectionException e) {
//            throw new DaoException("Unable to connect to server or database", e);
//        }
//
//        return menuItems;
//    }
//
//    @Override
//    public MenuItem createMenuItem(MenuItem newMenuItem){
//        String sql = "INSERT INTO menu_item (menu_id, menu_item_name, item_description) values (?, ?, ?) RETURNING menu_item_id;";
//        try {
//
//            int newMenuItemId = jdbcTemplate.queryForObject(sql, int.class, newMenuItem.getMenuId(),
//                    newMenuItem.getMenuItemName(), newMenuItem.getItemDescription());
//            newMenuItem = getMenuItemById(newMenuItemId);
//        } catch (CannotGetJdbcConnectionException e) {
//            throw new DaoException("Unable to connect to server or database", e);
//        } catch (DataIntegrityViolationException e) {
//            throw new DaoException("Data integrity violation", e);
//        }
//        return newMenuItem;
//    }
//
//    @Override
//    public MenuItem updateMenuItem(MenuItem updatedMenuItem){
//        String sql = "UPDATE menu_item SET menu_item_name = ?, item_description = ?, " +
//                "menu_id = ?::integer WHERE menu_item_id = ?::integer;";
//        try {
//            int affectedRowCount = jdbcTemplate.update(sql, updatedMenuItem.getMenuItemName(), updatedMenuItem.getItemDescription(),
//                    updatedMenuItem.getMenuId(), updatedMenuItem.getItemId());
//            //int affectedRowCount = jdbcTemplate.update(sql, "gfbabuji", "fbuaij", 1, 4);
//
//            if (affectedRowCount == 0) {
//                throw new DaoException("zero rows affected");
//            }
//
//            return getMenuItemById(updatedMenuItem.getItemId());
//        } catch (CannotGetJdbcConnectionException e) {
//            throw new DaoException("Unable to connect to server or database", e);
//        } catch (DataIntegrityViolationException e) {
//            throw new DaoException("Data integrity violation", e);
//        }
//
//    }
//
//    @Override
//    public void deleteMenuItem(MenuItem menuItem){
//        String sql = "DELETE FROM menu_item WHERE menu_item_id = ?";
//        try {
//            jdbcTemplate.update(sql,menuItem.getItemId());
//        } catch (CannotGetJdbcConnectionException e) {
//            throw new DaoException("Unable to connect to server or database", e);
//        } catch (DataIntegrityViolationException e) {
//            throw new DaoException("Data integrity violation", e);
//        }
//    }

    private MenuItem mapRowToMenuItem(SqlRowSet rs){
        MenuItem menuItem = new MenuItem();
        menuItem.setMenuItemId(rs.getInt("menu_item_id"));
        menuItem.setMenuItemName(rs.getString("menu_item_name"));
        menuItem.setItemDescription(rs.getString("item_description"));
        return menuItem;
    }

}
