import React, { useState, useEffect } from "react";
import UserService from "../services/UserService";
import SearchBox from "../components/SearchBox/SearchBox";
import { useLocation, useNavigate } from "react-router-dom";
import InviteService from "../services/InviteService";
import './InviteForm.css'; 

export default function InviteForm() {
    const location = useLocation();
    const navigate = useNavigate();
    const cookoutId = location.state?.cookoutId;
    const [allUsers, setAllUsers] = useState([]);
    const [attendeeSelection, setAttendeeSelection] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [submittedGuests, setSubmittedGuests] = useState([]);

    const handleHomeClick = () => {
        navigate('/');
    };

    const handleLogoutClick = () => {
        localStorage.removeItem('authToken');
        sessionStorage.clear();
        navigate('/login');
    };

    useEffect(() => {
        UserService.getAllUsers()
          .then(response => {
            const names = response.data.map(user => user.username);
            setAllUsers(names);
        })
           .catch(error => {console.error("Failed to retrieve users:", error)
        });
    }, []);

    useEffect(() => {
        if (!cookoutId) return;
    
        async function loadExistingGuests() {
            try {
                const response = await InviteService.getInvitesByCookoutId(cookoutId);
                console.log("Existing invites from backend:", response.data);

                const existingGuests = response.data.map(invite => invite.attendeeUsername);
                console.log("Mapped existingGuests:", existingGuests);

                
                setAttendeeSelection(existingGuests);
                setAllUsers(prevUsers => prevUsers.filter(user => !existingGuests.includes(user)));
    
                setSubmittedGuests(existingGuests);
            } catch (error) {
                console.error("Failed to fetch existing guest list:", error);
            }
        }
    
        loadExistingGuests();
    }, [cookoutId]);

    function handleSelectUser (username) {
        setAttendeeSelection([...attendeeSelection, username]);
        setAllUsers(allUsers.filter(user => user !== username));
        setSearchTerm("");
    }

    async function handleRemoveUser(username) {
        setAttendeeSelection(prev => prev.filter(u => u !== username));
        setAllUsers(prev => [...prev, username]);
    
        if (submittedGuests.includes(username)) {
            try {
                await InviteService.deleteInvite(cookoutId, username);
                setSubmittedGuests(prev => prev.filter(u => u !== username));
                console.log(`Removed ${username} from cookout ${cookoutId}`);
            } catch (error) {
                console.error(`Failed to remove ${username} from cookout:`, error);
            }
        }
    }

    const handleCreateGuestList = async () => {

        const newGuests = attendeeSelection.filter(username => !submittedGuests.includes(username));


        if (!newGuests.length) {
            alert("No new guests to add");
            return;
        }
    
        try {
            for (let username of newGuests) {
                await InviteService.createInvite({
                    cookoutId: cookoutId,
                    attendeeUsername: username,
                });
            }
            setSubmittedGuests(prev => [...prev, ...newGuests]);
            alert("Guest List Updated Successfully!");
        } catch (error) {
            console.error("Failed to create the guest list: ", error);
            alert("Failed to create the guest list");
        }
    };

    const handleCopyInviteLink = () => {
        if (!cookoutId) return;
      
        const baseUrl = window.location.origin;
        const inviteLink = `${baseUrl}/register?cookoutId=${cookoutId}`;
      
        navigator.clipboard.writeText(inviteLink)
          .then(() => {
            alert("Invite link copied to clipboard!");
          })
          .catch((err) => {
            console.error("Failed to copy invite link: ", err);
            alert("Failed to copy invite link.");
          });
      };
      
        
    const filteredUsers = allUsers.filter(username => 
        username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <header>
                <h1>The Cookout</h1>
                <div>
                    <button className="regular-btn" onClick={handleHomeClick}>Home</button>
                    <button className="logout-btn" onClick={handleLogoutClick}>Logout</button>
                </div>
            </header>

            <div className="invite-form-container">
                <div className="invite-form-header">
                    <h1>Invite Users</h1>
                    <p>Search and select guests for your cookout</p>
                </div>

                <div className="invite-form-content">
                    <div className="invite-section">
                        <h2>Search Users</h2>
                        <div className="search-container">
                            <SearchBox 
                                className="search-box"
                                onChange={setSearchTerm} 
                                placeholder="Search for users..."
                            />
                        </div>
                        
                        {searchTerm && (
                            <div className="search-results">
                                <ul className="user-list">
                                    {filteredUsers.length > 0 ? (
                                        filteredUsers.map((username, index) => (
                                            <li 
                                                key={index} 
                                                className="user-item"
                                                onClick={() => handleSelectUser(username)}
                                            >
                                                <span>{username}</span>
                                                <span style={{fontSize: '0.8em', opacity: 0.7}}>Click to add</span>
                                            </li>
                                        ))
                                    ) : (
                                        <div className="empty-state empty-search">
                                            <p>No users found matching "{searchTerm}"</p>
                                        </div>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="invite-section">
                        <h2>Selected Guests ({attendeeSelection.length})</h2>
                        {attendeeSelection.length > 0 ? (
                            <ul className="user-list">
                                {attendeeSelection.map((username, index) => (
                                    <li key={index} className="attendee-item">
                                        <span className="attendee-name">{username}</span>
                                        <button 
                                            className="remove-button"
                                            onClick={() => handleRemoveUser(username)}
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="empty-state empty-attendees">
                                <p>No guests selected yet</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="create-button-container">
                    <button 
                        className="create-guest-list-btn"
                        onClick={handleCreateGuestList}
                        disabled={attendeeSelection.length === 0}
                    >
                        Create Guest List ({attendeeSelection.length} guests)
                    </button>
                </div>
                <div className="copy-invite-link-container">
                    <button 
                        className="copy-invite-link-btn" 
                        onClick={handleCopyInviteLink}
                    >
                        Copy Invite Link
                    </button>
                </div>

            </div>
        </>
    );
}