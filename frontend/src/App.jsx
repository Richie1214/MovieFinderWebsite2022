import React from 'react';
import './App.css';

import axios from 'axios';

import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

import { ThemeProvider } from '@mui/material/styles';

import BanList from './pages/BanList';
import HomePage from './pages/HomePage';
import MovieDetail from './pages/MovieDetail';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyProfilePage from './pages/MyProfilePage';
import MyWishlistPage from './pages/MyWishlistPage';
import OtherWishlistPage from './pages/OtherWishlistPage';
import FormTypePage from './pages/FormTypePage';
import ApprovedReviewerPage from './pages/ApprovedReviewerPage';
import SearchResults from './pages/SearchResults';
import SubmittedFormPage from './pages/SubmittedFormPage';
import CompanyRepPage from './pages/CompanyRepPage';
import CompanyPage from './pages/CompanyPage';
import CompanyAllPosts from './pages/CompanyAllPosts';
import SelectAdminPower from './pages/SelectAdminPower';
import AdminDirectPromoteReject from './pages/AdminDirectPromoteReject';
import AnalyticsPage from './pages/AnalyticsPage';

import Background from './components/Background';
import MenuBar from './components/MenuBar'

import myTheme from './color';
import BACKEND_PORT from './BACKEND_PORT';

import { getUserType } from './components/helper';
import Companies from './pages/Companies';

const App = () => {
  const [loggedIn, setLoggedIn] = React.useState((localStorage.token !== ''));
  const [userType, setUserType] = React.useState('');
  
  // React.useEffect(() => {
  //   (async () => {
  //     await getUserType(loggedIn, setUserType);
  //   })();
  // }, [])
  
  React.useEffect(() => {
    (async () => {
      await getUserType(loggedIn, setUserType);
    })();
    if (!loggedIn) {
      setUserType('not');
    }
  }, [loggedIn])

  return (
    <ThemeProvider theme={myTheme}>
      <Background height="100vh" display="flex" flexDirection="column">
        <Router>
         <MenuBar loggedIn={loggedIn} setLoggedIn={setLoggedIn} userType={userType} />
          <Routes>
            <Route
              exact path="/"
              element={<HomePage />}
            />
            <Route
              path="/search"
              element={<SearchResults />}
            />
            <Route 
              exact path="/moviedetail"
              element={<MovieDetail loggedIn={loggedIn} userType={userType} />}
              // Yes, I will change the path later, once we have the API set up. The path will be something like
              // /moviedetail/{movieid} or something.
            />
            <Route
              exact path="/login"
              element={<LoginPage setLoggedIn={setLoggedIn} setUserType={setUserType} />}
            />
            <Route
              exact path="/register"
              element={<RegisterPage setLoggedIn={setLoggedIn} />}
            />
            <Route
              exact path="/profile/"
              element={<MyProfilePage loggedIn={loggedIn} setLoggedIn={setLoggedIn} userType={userType} />}
            />
            <Route
              exact path="/wishlist/own"
              element={<MyWishlistPage />}
            />
            <Route
              exact path="/banlist"
              element={<BanList />}
            />
            <Route
              path="/wishlist" 
              element={<OtherWishlistPage />}
            />
            <Route
              path="/forms"
              element={<FormTypePage userType={userType}/>}
            />
            <Route
              path="/forms/submitted"
              element={<SubmittedFormPage isOwnForms={true} />}
            />
            <Route 
              path="/forms/reviewer"
              element={<ApprovedReviewerPage userType={userType} />}
            />
            <Route
              path="/forms/company"
              element={<CompanyRepPage userType={userType} />}
            />
            <Route
              path="/site_admin/forms"
              element={<SubmittedFormPage isOwnForms={false} userType={userType} />}
            />
            <Route
              path="/site_admin/select"
              element={<SelectAdminPower />}
            />
            <Route
              path="/site_admin/manage"
              element={<AdminDirectPromoteReject userType={userType} />}
            />
            <Route
              path="/company"
              element={<CompanyPage userType={userType} />}
            />
            <Route
              path="/company/posts"
              element={<CompanyAllPosts userType={userType} />}
            />
            <Route
              path="/moviedetail/analytics"
              element={<AnalyticsPage userType={userType} />}
            />
            <Route
              path="company/all"
              element={<Companies userType={userType} />}
            />
          </Routes>
        </Router>
      </Background>
    </ThemeProvider>
  );
}

export default App;
