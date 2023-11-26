import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import TheatersIcon from '@mui/icons-material/Theaters';
import ListIcon from '@mui/icons-material/List';

import { Link } from 'react-router-dom';

import { getUserType } from './helper';

const MenuBar = (props) => {
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    setAnchorElUser(null);
    localStorage['token'] = '';
    localStorage['email'] = '';
    localStorage['username'] = '';
    localStorage['uid'] = '';
    localStorage['cid'] = '';
    props.setLoggedIn(false);
  }

  return (
    <AppBar color="secondary" position="static">
      <Container maxWidth="100%">
        <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Link to="/">
              <TheatersIcon
                fontSize="large"
                sx={{ mr: 1, color: 'primary.light' }}
              />
            </Link>
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              color="primary.light"
              sx={{
                mr: 2,
                fontFamily: 'Arial',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Movie Finder
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <ListIcon />
            </IconButton>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem component={Link} to='/company/all' key="Companies" onClick={handleCloseUserMenu}>
                <Typography textAlign="center">Companies</Typography>
              </MenuItem>
              { !props.loggedIn ?
                <div>
                  <MenuItem component={Link} to='/login' key="Login" onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">Login</Typography>
                  </MenuItem>
                  <MenuItem component={Link} to='/register' key="Register" onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">Register</Typography>
                  </MenuItem>
                </div>
              : <div>
                  <MenuItem component={Link} to={`/profile?id=${localStorage['uid']}`} key="Profile" onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">Profile</Typography>
                  </MenuItem>
                  {props.userType === 'company' &&
                  <MenuItem component={Link} to={`/company?id=${localStorage['cid']}`} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">Company Page</Typography>
                  </MenuItem>
                  }
                  <MenuItem component={Link} to='/wishlist/own' key="Wishlist" onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">Wishlist</Typography>
                  </MenuItem>
                  <MenuItem component={Link} to='/banlist' key="Banlist" onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">Ban List</Typography>
                  </MenuItem>
                  {
                    (props.userType === 'site_admin') && (
                      <MenuItem component={Link} to='/site_admin/select' key="Admin" onClick={handleCloseUserMenu}>
                        <Typography textAlign="center">Admin</Typography>
                      </MenuItem>
                    )
                  }
                  <MenuItem component={Link} to='/' key="Logout" onClick={handleLogout}>
                    <Typography textAlign="center">Log Out</Typography>
                  </MenuItem>
                </div>
              }
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default MenuBar;