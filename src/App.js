import { useState, useEffect } from "react";
import Bar from "./Components/Bar";
import { BrowserRouter as Router, Routes , Route, Outlet, useLocation } from "react-router-dom";
import {createTheme,ThemeProvider} from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import Drives from "./pages/Drives";
import Fleet from "./pages/Fleet";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { grey, lightBlue } from '@mui/material/colors';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./Routes/privateRoute";



function App() {

  function AppBar({darkMode, changeTheme}) {
    const location = useLocation();
    return <>
      {location.pathname !== '/' && <Bar id="menuBar" check={darkMode} change={changeTheme}/>}
      <Outlet/>
    </>
  }


  const getDesignTokens = (mode) => ({
    palette: {
      mode,
      primary: {
        ...(mode === 'dark' 
        ? {
          main: '#ffffff',
          } 
        :{ 
          main: lightBlue[900],
        }),
      },
      button: {
        ...(mode === 'dark' 
        ? {
          main: '#000000',
          } 
        :{ 
          main: '#e0e0e0',
        }),
      },
      background: {
        ...(mode === 'dark' 
        ? {
          paper: "#f00",
          } 
        :{ 
          paper: "#f00",
        }),
      },
      secondary: {
        ...(mode === 'dark' 
        ? {
          main: '#ffffff',
        }
        : {
          main: '#ffffff',
        }
        
  )},
      ...(mode === 'dark' 
      ? {
        background: {
          default: grey[900],
          paper: grey[900],
        },
        }
      : {
        background: {
          default: grey[50],
          paper: grey[50],
        },
      }),
      text: {
        ...(mode === 'light'
          ? {
              primary: grey[900],
              secondary: grey[800],
            }
          : {
              primary: '#fff',
              secondary: grey[500],
            }),
      },
    },
  });

  const[darkMode,setDarkMode]=useState(false);
  const theme = createTheme(getDesignTokens(darkMode?"dark":"light"));
  
  const changeTheme = () => {
    localStorage.setItem("dark", darkMode ? "light" : "dark");
    setDarkMode(!darkMode);
    console.log(darkMode);
  };

  useEffect(() => {
    const mode = localStorage.getItem("dark") || "dark";
    if (mode !== "dark") {
      setDarkMode(false);
    }else{
      setDarkMode(true);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Router>
      <Routes>
      <Route path="/" element={<AppBar darkMode={darkMode} changeTheme={changeTheme}/>}>
        <Route index element={<Login index darkMode={darkMode}/>}/>
        <Route path="/Home" element={<PrivateRoute/>}>
            <Route path="/Home/" element={<Home/>}/>
        </Route>
        <Route path="/Drives" element={<PrivateRoute/>}>
            <Route path="/Drives/" element={<Drives/>}/>
        </Route>
        <Route path="/Fleet" element={<PrivateRoute/>}>
            <Route path="/Fleet/" element={<Fleet/>}/>
        </Route>
      </Route>
      </Routes>
      <ToastContainer position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        />

    </Router>
    </ThemeProvider>
  );
}

export default App;