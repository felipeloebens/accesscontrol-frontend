import * as React from 'react';
import { useEffect, useState } from 'react';
import {  toast } from 'react-toastify';
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import FockinkBlack from'./images/fockinkBlack.png';
import FockinkWhite from'./images/fockinkWhite.png';
import { Button, TextField, Link, Box, Typography, Container, CssBaseline } from '@mui/material/';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://www.fockink.ind.br">
        Fockink
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


export default function SignIn({darkMode}) {

async function loginApi(){
    const dataLogin = await axios.post(`http://${process.env.REACT_APP_BACKEND_SERVER}/api/loginad/auth/`,{ user: usernameCrypt, pass: passwordCrypt});
    return dataLogin.data;
  }

  const [ username , setUsername ] = useState(null);
  const [ password , setPassword ] = useState(null);
  const [ usernameCrypt, setUsernameCrypt] = useState(null);
  const [ passwordCrypt, setPasswordCrypt] = useState(null);
  const [ sendLogin, setSendLogin] = useState(false);

  async function loadUserData(){
    const user = JSON.parse(localStorage.getItem('userData') || "{}");
    if(user.token){
      const dataLogin = await axios.post(`http://${process.env.REACT_APP_BACKEND_SERVER}/api/loginad/checkToken/`,{ token: user.token });
    return dataLogin.data;
   }else{
    return {permission : "N"};
   }
  }

  const navigate = useNavigate();

  useEffect(() => {
    loadUserData().then((res) => {if(res.permission === "S"){
      navigate("/Home")
    }});
  

  }, []);

  useEffect(() => {
    if(password !== null){
    const hashPassword = CryptoJS.AES.encrypt(password,'Secret pass').toString();
        setPasswordCrypt(hashPassword);
    }else{
        setPasswordCrypt(null);
    }

  }, [password]);

  useEffect(() => {
    if(username !== null){
    const hashUsername = CryptoJS.AES.encrypt(username, 'Secret user' ).toString();
        setUsernameCrypt(hashUsername);
    }else{
        setUsernameCrypt(null);
    }
  }, [username]);



  useEffect(() => {
    if(sendLogin && (usernameCrypt !== null) && (passwordCrypt !== null)){
        loginApi().then((response) =>  {
          localStorage.setItem("userData", JSON.stringify(response)); 
          setSendLogin(false)
          if(response.permission === "S"){ 
            navigate("/Home")
          }else{ 
            toast.error("Verifique o usuário e senha!")
          }
        });
    }else if(sendLogin && (usernameCrypt === null) && (passwordCrypt === null)){
      toast.error("Verifique o usuário e senha!")
    }
  }, [sendLogin]);

  return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <img  src={darkMode ? FockinkWhite : FockinkBlack} style={{marginTop: "15px"}}  alt="fockinkLogo"/>
          <Typography variant="h6" style={{marginTop:"40px" }}>
            Sistema de Gestão de Logística Interna
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              id="loginAd"
              label="Usuário"
              name="loginAd"
              autoComplete="loginAd"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              label="Senha"
              type="password"
              onKeyDown={(e) => e.key === 'Enter' && setSendLogin(true)}
              id="password"
              autoComplete="current-password"
            />
            <Button
              fullWidth
              onClick={() => setSendLogin(true)}
              color='button'
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
  );
}