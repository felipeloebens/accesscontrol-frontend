import {  Navigate, Outlet } from "react-router-dom";

function PrivateRoute() {
    const user = localStorage.getItem('userData');

    if (!user) {
        return <Navigate to={'/'} />
    }
    return <Outlet/> 
}

export default PrivateRoute