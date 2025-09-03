package com.techelevator.dao;

import com.techelevator.model.Invite;

import java.util.List;

public interface InviteDao {

    List<Invite> getInvites();

    Invite getInviteById(int inviteId);

    List<Invite> getInvitesByAttendeeId(int attendeeId);

    List<Invite> getInvitesByUsername(String username);

    Invite createInvite(Invite invite, String username);

    List<Invite> getInvitesByCookout(int cookoutId);

    int deleteInviteById(int inviteId);

    Invite updateInvite(Invite invite, int inviteId);

    int deleteInviteByCookoutIdAndUsername(int cookoutId, String username);
    }
