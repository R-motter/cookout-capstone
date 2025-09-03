import { useState } from "react";
import CookoutService from "../../services/CookoutService";
import InviteService from "../../services/InviteService";
import MenuService from "../../services/MenuService";
import MenuItemService from "../../services/MenuItemService";
import { useLocation, useNavigate} from "react-router-dom";
import './AddCookoutView.css';

export default function CreateCookoutView() {
    const navigate = useNavigate();
    const location = useLocation();

    const [cookout, setCookout] = useState({
        cookoutName: "",
        cookoutDate: "",
        cookoutTime: "",
        cookoutLocation: "",
        chefUsername: ""
    });

    // Handle navigation functions
    const handleHomeClick = () => {
        navigate("/");
    };

    const handleCancelClick = () => {
        navigate(-1); // Go back to previous page
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    function handleCookoutChange(event) {
        const { name, value } = event.target;
        setCookout(prev => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            const cookoutResponse = await CookoutService.createCookout(cookout);
            const responseData = cookoutResponse.data;
            const cookoutId = responseData.id;
            
            if (!cookoutId && cookoutId !== 0) {
                throw new Error("Cookout ID not returned from the backend");
            }

            alert(`Cookout "${cookout.cookoutName}" successfully created!`);

            setCookout({
                cookoutName: "",
                cookoutDate: "",
                cookoutTime: "",
                cookoutLocation: "",
                chefUsername: ""
            });

            navigate("/");

        } catch(err) {
            alert(`Error: ${err.message}`);
        }
    }

    return (
        <>
            <header>
                <h1>The Cookout</h1>
                <div id="button-div">
                    <button className="button-link" onClick={handleHomeClick}>Home</button>
                    <button className="button-link" onClick={handleCancelClick}>Cancel</button>
                    <button className="outlined-button" onClick={handleLogout}>Logout</button>
                   
                </div>
            </header>

            <main>
                <h1>Step One: Add Cookout Details</h1>
                
                <div className="details-card">
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="cookoutName">Cookout Name</label>
                        </div>
                        <div>
                            <input
                                type="text"
                                id="cookoutName"
                                name="cookoutName"
                                value={cookout.cookoutName}
                                onChange={handleCookoutChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="cookoutDate">Cookout Date</label>
                        </div>
                        <div>
                            <input
                                type="date"
                                id="cookoutDate"
                                name="cookoutDate"
                                value={cookout.cookoutDate}
                                onChange={handleCookoutChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="cookoutTime">Cookout Time</label>
                        </div>
                        <div>
                            <input
                                type="time"
                                id="cookoutTime"
                                name="cookoutTime"
                                value={cookout.cookoutTime}
                                onChange={handleCookoutChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="cookoutLocation">Location</label>
                        </div>
                        <div>
                            <input
                                type="text"
                                id="cookoutLocation"
                                name="cookoutLocation"
                                value={cookout.cookoutLocation}
                                onChange={handleCookoutChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="chefUsername">Chef Username</label>
                        </div>
                        <div>
                            <input
                                type="text"
                                id="chefUsername"
                                name="chefUsername"
                                value={cookout.chefUsername}
                                onChange={handleCookoutChange}
                            />
                        </div>

                        <input type="submit" value="Create Cookout" />
                         
                    </form>
                </div>
            </main>
        </>
    );
}