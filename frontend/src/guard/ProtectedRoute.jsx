import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// eslint-disable-next-line react/prop-types
export default function ProtectedRoute({children, allowedRoles = []}){
    const {user, authenticated} = useContext(AuthContext);  
    const [checked, setChecked] = useState(false);
    
    // const userRole = "SCHOOL";
    // const authenticated = true;

    useEffect(() => {
        setChecked(true)
    }, []);

    if(checked && !authenticated) return <Navigate to={'/login'} />

    if(checked && allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to={'/login'}/>
    
    if (checked) {
        return children;  
    }   
}