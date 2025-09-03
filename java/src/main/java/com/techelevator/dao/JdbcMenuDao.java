package com.techelevator.dao;

import java.util.ArrayList;
import java.util.List;

import com.techelevator.exception.DaoException;
import com.techelevator.model.Menu;
import com.techelevator.model.MenuItem;
import com.techelevator.model.RegisterUserDto;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.CannotGetJdbcConnectionException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Component;

@Component
public class JdbcMenuDao implements MenuDao{

    private final JdbcTemplate jdbcTemplate;

    public JdbcMenuDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<Menu> getMenus(){
        List<Menu> menus = new ArrayList<>();

        String sql = "SELECT * FROM menu";

        try {
            SqlRowSet results = jdbcTemplate.queryForRowSet(sql);
            while (results.next()) {
                Menu menu = mapRowToMenu(results);
                menus.add(menu);
            }
        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        }

        return menus;
    }

    @Override
    public Menu getMenuById(int menuId){
        Menu menu = null;

        String sql = "SELECT * FROM menu WHERE menu_id = ?;";

        try {
            SqlRowSet results = jdbcTemplate.queryForRowSet(sql, menuId);
            if (results.next()) {
                menu = mapRowToMenu(results);
            }
        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        }

        return menu;
    }

    @Override
    public Menu createMenu(Menu menu) {
        String sql = "INSERT INTO menu (cookout_id) values (?);";
        try {
            jdbcTemplate.update(sql, menu.getCookoutId());
        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        } catch (DataIntegrityViolationException e) {
            throw new DaoException("Data integrity violation", e);
        }
        return menu;
    }

    @Override
    public Menu updateMenu(Menu menu, int cookoutId){
        String sql = "UPDATE menu SET cookout_id = ? WHERE menu_id = ?";
        try {
            jdbcTemplate.update(sql, cookoutId, menu.getMenuId());
        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        } catch (DataIntegrityViolationException e) {
            throw new DaoException("Data integrity violation", e);
        }
        return menu;
    }

    @Override
    public void deleteMenuById (int id){
        Menu menu = null;
        String sql = "DELETE FROM menu WHERE menu_id = ?;";
        try {
            jdbcTemplate.update(sql, menu.getMenuId());
        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        } catch (DataIntegrityViolationException e) {
            throw new DaoException("Data integrity violation", e);
        }
    }

    private Menu mapRowToMenu(SqlRowSet rs){
        Menu menu = new Menu();
        menu.setMenuId(rs.getInt("menu_id"));
        menu.setCookoutId(rs.getInt("cookout_id"));
        return menu;
    }

}
