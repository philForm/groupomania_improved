import { useNavigate } from "react-router-dom";
import { tokenService } from "@/services/service";

const AuthGuard = ({ children }) => {

    const navigate = useNavigate();

    if (!tokenService.isLogged) {
        navigate('/form')
    }
    return children;
};

export default AuthGuard;