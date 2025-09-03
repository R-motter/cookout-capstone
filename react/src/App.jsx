import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeView from './views/HomeView/HomeView';
import LoginView from './views/LoginView/LoginView';
import LogoutView from './views/LogoutView';
import RegisterView from './views/RegisterView/RegisterView';
import UserProfileView from './views/UserProfileView/UserProfileView';
import MainNav from './components/MainNav/MainNav';
import ProtectedRoute from './components/ProtectedRoute';
import AddCookoutView from './views/AddCookoutView/AddCookoutView';
import InviteForm from './Pages/InviteForm';
import Menu from './views/MenuView/Menu';
import OrderView from './views/OrderView/OrderView';
import CookoutView from './views/CookoutView/CookoutView';
import ChefView from './views/ChefView/ChefView';
import CookoutDetailsView from './views/CookoutDetailsView/CookoutDetailsView';

export default function App() {

  return (
    <BrowserRouter>
      <div id="app">
          <MainNav />
          <main id="main-content">
            <Routes>
              <Route path="/" element={<HomeView />} />
              <Route path="/login" element={<LoginView />} />
              <Route path="/logout" element={<LogoutView />} />
              <Route path="/register" element={<RegisterView />} />
              <Route path="/cookouts" element={<AddCookoutView />} />
              <Route path="/invite" element={<InviteForm/>} />
              {/* <Route path="cookouts/:cookoutId/guests" element={<GuestList/>} /> */}
              <Route path ="/viewCookouts" element={<CookoutView/>} />
              {<Route path ="/Menu" element={<Menu/>} /> }
              {<Route path ="/order" element={<OrderView/>} />}
              <Route path="/chefView" element={<ChefView/>}/>
              <Route path="/cookout/:id" element={<CookoutDetailsView />} />
              <Route
                path="/userProfile"
                element={
                  <ProtectedRoute>
                    <UserProfileView />
                  </ProtectedRoute>
                }
              />
              <Route path="/cookouts" element=
              {<ProtectedRoute>
                <AddCookoutView />
              </ProtectedRoute>
              }
            />
            </Routes>
          </main>
      </div>
    </BrowserRouter>
  );
  
}
