import { useContext, useEffect } from "react"
import { AuthContext } from "../../../context/AuthContext"
import { useNavigate } from "react-router-dom";

export default function Logout() {
    const {logout} = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        logout();
        navigate("/login")
    }, [])
  return (
    <>
      Logout
    </>
  )
}
