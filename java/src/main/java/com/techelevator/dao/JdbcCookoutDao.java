package com.techelevator.dao;

import com.techelevator.exception.DaoException;
import com.techelevator.model.Cookout;
import org.springframework.jdbc.CannotGetJdbcConnectionException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Component;

import java.sql.Time;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class JdbcCookoutDao implements CookoutDao{

    private final JdbcTemplate jdbcTemplate;

    public JdbcCookoutDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<Cookout> getCookouts() {
        List<Cookout> cookouts = new ArrayList<>();
        String sql = "SELECT * FROM cookouts;";
        try {
            SqlRowSet results = jdbcTemplate.queryForRowSet(sql);
            while (results.next()) {
                Cookout cookout = mapRowToCookout(results);
                cookouts.add(cookout);
            }
        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        }
        return cookouts;

    }


    @Override
    public Cookout getCookoutById(int cookoutId) {
        Cookout cookout = null;
        String sql = "SELECT * FROM cookouts WHERE cookout_id = ?;";
        try {
            SqlRowSet result = jdbcTemplate.queryForRowSet(sql, cookoutId);

            if (result.next()) {
                cookout = mapRowToCookout(result);
            }
        } catch (CannotGetJdbcConnectionException e) {
                throw new DaoException("Unable to connect to server or database", e);
            }

        return cookout;
    }

    @Override
    public List<Cookout> getCookoutsByHostUsername(String username) {
       List<Cookout> cookouts = new ArrayList<>();

        int userId = jdbcTemplate.queryForObject("SELECT user_id FROM users WHERE username = ?", int.class, username);

        int hostId = jdbcTemplate.queryForObject("SELECT host_id FROM roles WHERE user_id = ?", int.class, userId);

        String sql = "SELECT * FROM cookouts WHERE host_id = ?;";
        try {
            SqlRowSet results = jdbcTemplate.queryForRowSet(sql, hostId);
            while (results.next()) {
                cookouts.add(mapRowToCookout(results));
            }
        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        }

        return cookouts;
    }

    @Override
    public Map<String, List<Cookout>> getCookoutByUserId(int userId) {
        Map<String, List<Cookout>> result = new HashMap<>();

        //Cookouts the user is hosting
        String cookoutAsHostSql = "SELECT cookouts.* FROM cookouts JOIN roles ON cookouts.host_id = roles.host_id WHERE roles.user_id = ?;";

        List<Cookout> hosting = new ArrayList<>();
        SqlRowSet hostingResult = jdbcTemplate.queryForRowSet(cookoutAsHostSql, userId);
        while (hostingResult.next()) {
            hosting.add(mapRowToCookout(hostingResult));
        }
        result.put("hosting", hosting);

        //Cookouts the user is attending
        String cookoutAsAttendeeSql = "SELECT cookouts.* FROM cookouts JOIN invite ON cookouts.cookout_id = invite.cookout_id " +
                "JOIN roles ON invite.attendee_id = roles.attendee_id WHERE roles.user_id = ?;";

        List<Cookout> attending = new ArrayList<>();
        SqlRowSet attendingResult = jdbcTemplate.queryForRowSet(cookoutAsAttendeeSql, userId);
        while (attendingResult.next()) {
            attending.add(mapRowToCookout(attendingResult));
        }
        result.put("attending", attending);

        //Cookouts the user is the chef
        String cookoutAsChefSql = "SELECT cookouts.* FROM cookouts JOIN roles ON cookouts.chef_id = roles.chef_id WHERE roles.user_id = ?;";

        List<Cookout> chef = new ArrayList<>();
        SqlRowSet chefResult = jdbcTemplate.queryForRowSet(cookoutAsChefSql, userId);
        while (chefResult.next()) {
            chef.add(mapRowToCookout(chefResult));
        }
        result.put("chef", chef);

        return result;
    }

    @Override
    public Cookout createCookout(Cookout cookout, String username) {


        int userId = jdbcTemplate.queryForObject("SELECT user_id FROM users WHERE username = ?", int.class, username);

        int hostId = jdbcTemplate.queryForObject("SELECT host_id FROM roles WHERE user_id = ?", int.class, userId);

        cookout.setHostId(hostId);

        if (cookout.getChefUsername() != null && !cookout.getChefUsername().isEmpty()) {
            int chefUserId = jdbcTemplate.queryForObject("SELECT user_id FROM users WHERE username = ?", int.class, cookout.getChefUsername());
            int chefId = jdbcTemplate.queryForObject("SELECT chef_id FROM roles WHERE user_id = ?", int.class, chefUserId);

            cookout.setChefId(chefId);
        }

        java.sql.Time cookoutTime = null;
        if (cookout.getCookoutTime() != null) {
            cookoutTime = java.sql.Time.valueOf(cookout.getCookoutTime());
        }
        java.sql.Date cookoutDate = null;
        if (cookout.getCookoutDate() != null) {
            cookoutDate = java.sql.Date.valueOf(cookout.getCookoutDate());
        }

        String insertCookoutSql = "INSERT INTO cookouts (host_id, chef_id, cookout_name, cookout_location, " +
                "cookout_date, cookout_time) VALUES (?,?,?,?,?,?) RETURNING cookout_id;";

        try {

            int newCookoutId = jdbcTemplate.queryForObject(insertCookoutSql, int.class,
                    cookout.getHostId(),
                    cookout.getChefId(),
                    cookout.getCookoutName(),
                    cookout.getCookoutLocation(),
                    cookoutDate,
                    cookoutTime);

            cookout = getCookoutById(newCookoutId);

        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        }
        return cookout;
    }

    @Override
    public int deleteCookoutById(int cookoutId) {

        int affectedRowCount = 0;
        String sql = "DELETE FROM cookouts WHERE cookout_id = ?;";
        try {
            affectedRowCount = jdbcTemplate.update(sql, cookoutId);
        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        }

        return affectedRowCount;
    }

    @Override
    public Cookout updateCookout(Cookout cookout, int cookoutId) {
        Cookout updatedCookout = null;
        String updateSql = "UPDATE cookouts SET host_id = ?, chef_id = ?, cookout_name = ?, cookout_location = ?, " +
                "cookout_date = ?, cookout_time = ? WHERE cookout_id = ?;";
        int affectedRowCount = 0;
        try {
            if (cookout.getId() != cookoutId) {
                return null;
            } else {
                affectedRowCount = jdbcTemplate.update(updateSql, cookout.getHostId(), cookout.getChefId(), cookout.getCookoutName(),
                        cookout.getCookoutLocation(), cookout.getCookoutDate(), cookout.getCookoutTime(), cookout.getId());
            }
            if(affectedRowCount == 0){
                throw new DaoException("zero rows affected, expected update not performed.");
            } else {
                updatedCookout = getCookoutById(cookout.getId());
            }

        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        }


        return updatedCookout;
    }

    private Cookout mapRowToCookout(SqlRowSet rs) {
        Cookout cookout = new Cookout();
        cookout.setId(rs.getInt("cookout_id"));
        cookout.setChefId(rs.getInt("chef_id"));
        cookout.setHostId(rs.getInt("host_id"));
        cookout.setCookoutDate(rs.getDate("cookout_date").toLocalDate());
        cookout.setCookoutTime(rs.getTime("cookout_time").toLocalTime());
        cookout.setCookoutName(rs.getString("cookout_name"));
        cookout.setCookoutLocation(rs.getString("cookout_location"));
        return cookout;
    }

}
