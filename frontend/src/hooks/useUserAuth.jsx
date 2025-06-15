import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import axiosInstance  from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath"


export const useUserAuth = () => {
    const {user,updateUser,clearUser} = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if(user) return

        let isMounted = true;

        const fetchUserData = async () => {
            try {
                const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO)

                if (isMounted) {
                    if (response.data) {
                        updateUser(response.data);
                    } else {
                        clearUser();
                        navigate("/login");
                    }
                }
            }
            catch (error) {
                console.error("Error fetching user data:", error);
                clearUser();
                navigate("/login");
            }
        }
        fetchUserData();

        return () => {
            isMounted = false;
        };
    }, [user, updateUser, clearUser, navigate])
}
