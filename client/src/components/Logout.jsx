import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
  
        sessionStorage.removeItem("userName");

        // Redirect to login
        navigate("/login");
    }, []);

    return null;
};

export default Logout;