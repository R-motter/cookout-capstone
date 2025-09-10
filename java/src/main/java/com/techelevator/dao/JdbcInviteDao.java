package com.techelevator.dao;

import com.techelevator.exception.DaoException;
import com.techelevator.model.Invite;
import com.techelevator.model.User;
import org.springframework.jdbc.CannotGetJdbcConnectionException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Component;


import java.util.ArrayList;
import java.util.List;

@Component
public class JdbcInviteDao implements InviteDao{

    private final JdbcTemplate jdbcTemplate;

    public JdbcInviteDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<Invite> getInvites() {
        List<Invite> invites = new ArrayList<>();
        String sql = "SELECT * FROM invite;";
        try {
            SqlRowSet results = jdbcTemplate.queryForRowSet(sql);
            while (results.next()) {
                Invite invite = mapRowToInvite(results);
                invites.add(invite);
            }
        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        }
        return invites;
    }

    @Override
    public Invite getInviteById(int inviteId) {
        Invite invite = null;
        String sql = "SELECT * FROM invite WHERE invite_id = ?;";
        try {
            SqlRowSet result = jdbcTemplate.queryForRowSet(sql, inviteId);
            if (result.next()) {
                invite = mapRowToInvite(result);
            }
        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        }

        return invite;
    }

    @Override
    public List<Invite> getInvitesByAttendeeId(int attendeeId) {
        List<Invite> invites = new ArrayList<>();
        String sql = "SELECT * FROM invite WHERE attendee_id = ?;";
        try {
            SqlRowSet results = jdbcTemplate.queryForRowSet(sql, attendeeId);
            while(results.next()) {
                invites.add(mapRowToInvite(results));
            }
        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        }

        return invites;
    }

    @Override
    public Invite createInvite(Invite invite, String username) {

        if (invite.getAttendeeUsername() != null && !invite.getAttendeeUsername().isEmpty()) {
            int attendeeUserId = jdbcTemplate.queryForObject("SELECT user_id FROM users WHERE username = ?", int.class, invite.getAttendeeUsername());
            int attendeeId = jdbcTemplate.queryForObject("SELECT attendee_id FROM roles WHERE user_id = ?", int.class, attendeeUserId);

            invite.setAttendeeId(attendeeId);
        }

        String sql = "INSERT INTO invite (attendee_id, cookout_id) VALUES (? , ? ) RETURNING invite_id;";
        try {
            int inviteId = jdbcTemplate.queryForObject(
                    sql, int.class, invite.getAttendeeId(), invite.getCookoutId()
            );
            invite.setInviteId(inviteId);
            return invite;
        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        }

    }

    @Override
    public List<Invite> getInvitesByUsername(String username) {
        List<Invite> invites = new ArrayList<>();

        int userId = jdbcTemplate.queryForObject("SELECT user_id FROM users WHERE username = ?", int.class, username);

        int attendeeId = jdbcTemplate.queryForObject("SELECT attendee_id FROM roles WHERE user_id = ?", int.class, userId);

        String sql = "SELECT * FROM invite WHERE attendee_id = ?;";
        try {
            SqlRowSet results = jdbcTemplate.queryForRowSet(sql, attendeeId);
            while (results.next()) {
                invites.add(mapRowToInvite(results));
            }
        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        }
        return invites;
    }

    @Override
    public List<Invite> getInvitesByCookout(int cookoutId) {
        String sql = "SELECT i.invite_id, i.cookout_id, i.attendee_id, u.username AS attendee_username FROM invite i " +
        "JOIN users u ON i.attendee_id = u.user_id " +
        "WHERE i.cookout_id = ?";

        SqlRowSet results = jdbcTemplate.queryForRowSet(sql, cookoutId);
        List<Invite> invites = new ArrayList<>();

        while (results.next()) {
            Invite invite = new Invite();
            invite.setInviteId(results.getInt("invite_id"));
            invite.setCookoutId(results.getInt("cookout_id"));
            invite.setAttendeeId(results.getInt("attendee_id"));
            invite.setAttendeeUsername(results.getString("attendee_username")); // <-- add this line
            invites.add(invite);
        }

        return invites;
    }

    @Override
    public int deleteInviteById(int inviteId) {
        int affectedRowCount = 0;
        String sql = "DELETE FROM invite WHERE invite_id = ?;";
        try {
            affectedRowCount = jdbcTemplate.update(sql, inviteId);
        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        }

        return affectedRowCount;
    }
    @Override
    public int deleteInviteByCookoutIdAndUsername(int cookoutId, String username) {
        int affectedRowCount = 0;

        String getUserIdSql = "SELECT user_id FROM users WHERE username = ?";
        String getAttendeeIdSql = "SELECT attendee_id FROM roles WHERE user_id = ?";
        String deleteSql = "DELETE FROM invite WHERE cookout_id = ? AND attendee_id = ?";

        try {
            int userId = jdbcTemplate.queryForObject(getUserIdSql, int.class, username);
            int attendeeId = jdbcTemplate.queryForObject(getAttendeeIdSql, int.class, userId);
            affectedRowCount = jdbcTemplate.update(deleteSql, cookoutId, attendeeId);
        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        }

        return affectedRowCount;
    }

    @Override
    public Invite updateInvite(Invite invite, int inviteId) {
        Invite updatedInvite;
        String updateSql = "UPDATE invite SET attendee_id = ?, cookout_id = ? WHERE invite_id = ?;";
        int affectedRowCount = 0;
        try {
            if (invite.getInviteId() != inviteId) {
                return null;
            } else {
                affectedRowCount = jdbcTemplate.update(updateSql, invite.getAttendeeId(), invite.getCookoutId(), inviteId);
            }
            if ( affectedRowCount == 0) {
                throw new DaoException("zero rows affected, expected update not performed.");
            } else {
                updatedInvite = getInviteById(invite.getInviteId());
            }
        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        }

        return updatedInvite;
    }

    private Invite mapRowToInvite(SqlRowSet rs) {
        Invite invite = new Invite();
        invite.setInviteId(rs.getInt("invite_id"));
        invite.setAttendeeId(rs.getInt("attendee_id"));
        invite.setCookoutId(rs.getInt("cookout_id"));
        return invite;
    }

}
