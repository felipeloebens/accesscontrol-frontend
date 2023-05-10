import React from 'react';
import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import {Menu as MenuIcon, Home as HomeIcon, Brightness4 , Brightness7, Close }  from '@mui/icons-material/';
import {Button, Box, Container, Menu, MenuItem, IconButton, Typography, Toolbar, AppBar, Tooltip, Avatar, Modal, Grid, TextField } from '@mui/material/';


const pages = [{text: 'Motoristas', link:'Drives'},
               {text: 'Frota', link:'Fleet'}];


const settings = ['Perfil', 'Logout'];

const styleModal = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width : 600,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  p: 4,
};

const styleCloseButton = {
  position: 'absolute',
  left: '91%',
  top: '2%',
};

export default function Bar({check,change}) {
  
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();
    const [ open, setOpen] = useState(false);

    const handleClose = () => setOpen(false);

    const onButtonClick = (e, row) => {
      setOpen(true)
  };
    
    const handleOpenNavMenu = (event) => {
      setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
      setAnchorElUser(event.currentTarget);
    };
  
    const handleCloseNavMenu = () => {
      setAnchorElNav(null);
    };
  
    const handleCloseUserMenu = (e) => {
      if(e.target.innerHTML === "Logout"){
        localStorage.removeItem("userData");
        navigate("/")
      }

      setAnchorElUser(null);
    };

    useEffect(() => {
      const user = JSON.parse(localStorage.getItem('userData') || "{}");
      setUserData(user);
    }, [])
    

  return (
<>
    <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={styleModal}>
            <Grid container padding={1} spacing={1}>
            <IconButton sx={styleCloseButton} onClick={handleClose}>
              <Close />
            </IconButton>
            <Typography id="modalTittle" variant="h6" component="h2" sx={{marginBottom : "10px"}}>
                Perfil
            </Typography>
            <Grid container spacing={1} padding={1}>
            <Grid item xs={12} md={6} lg={6} sx={{ justifyContent: "flex-start", display: "flex"}}>
              <TextField 
                id="user"
                label="Usuário" 
                variant="outlined" 
                value={userData !== null ? userData.user : ""}
                InputProps={{
                  readOnly: true,
                }}
              />
              </Grid>
              <Grid item xs={12} md={6} lg={6} sx={{ justifyContent: "flex-start", display: "flex"}}>
              <TextField 
                id="name"
                label="Nome" 
                variant="outlined" 
                value={userData !== null ? userData.name : ""}
                InputProps={{
                  readOnly: true,
                }}
              />
              </Grid>
              <Grid item xs={12} md={6} lg={6} sx={{ justifyContent: "flex-start", display: "flex"}}>
              <TextField 
                id="editWeight"
                label="Cargo" 
                variant="outlined" 
                value={userData !== null ? userData.occupation : ""}
                InputProps={{
                  readOnly: true,
                }}
              />
              </Grid>
            </Grid>
            </Grid>
            </Box>
          </Modal>

    <AppBar id="appBar" position="static">
      <Container maxWidth="xxl">
        <Toolbar disableGutters>
          <IconButton color='secondary'
          component={Link}
          to={"/Home"} sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}>
          <HomeIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              <MenuItem component={Link} to={"/"} key={"linkHome"} onClick={handleCloseNavMenu}>
                <Typography textAlign="center">Inicial</Typography>
              </MenuItem>
              {/* {pages.map((page) => (
                <MenuItem component={Link} to={`/${page.link}/`} key={page.link} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page.text}</Typography>
                </MenuItem>
              ))} */}
            </Menu>
          </Box>
          <IconButton sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} ></IconButton>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {/* {pages.map((page) => (
              <Button
                component={Link}
                to={`/${page.link}/`}
                key={page.link}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                 {page.text}
              </Button>
            ))} */}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp"/>
              </IconButton>
            </Tooltip>
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
            <MenuItem key={"darkmodeSwitch"} onClick={change}>
            <Typography textAlign="center">Escuro</Typography>
              <IconButton 
              color="default"
              onClick={change}
              >
              {check === 'dark' ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </MenuItem>
              {settings.map((setting) => (
                <MenuItem onClick={setting === 'Perfil' ? () => {setOpen(true); setAnchorElNav(null)} : handleCloseUserMenu} id={setting} key={setting}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

        </Toolbar>

      </Container>
    </AppBar>
    </>
  );
}