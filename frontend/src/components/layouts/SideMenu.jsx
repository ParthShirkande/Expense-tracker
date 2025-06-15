import React, { useContext } from 'react'
import { SIDE_MENU_DATA } from '../../utils/data'
import { UserContext } from '../../context/UserContext'
import { useNavigate } from "react-router-dom"
import CharAvatar from '../Cards/CharAvatar'

const SideMenu = ({ activeMenu }) => {
    const { user, clearUser } = useContext(UserContext)
    const navigate = useNavigate()

    const handleClick = (path, label) => {
        if (label === "Logout") {
            handleLogout();
            return;
        }
        navigate(path);
    };

    const handleLogout = () => {
        localStorage.clear()
        clearUser()
        navigate("/login")
    }

    return (
        <div className='w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 p-5 sticky top-[61px] z-20'>
            <div className='flex flex-col items-center mb-8 justify-center mt-3 gap-3'>
                {user?.profileImageUrl ? (
                    <img src={user.profileImageUrl || ""} alt="Profile Image" className='w-20 h-20 rounded-full bg-slate-400' />
                ) : (
                    <CharAvatar
                        fullName={user?.fullName}
                        width="w-20"
                        height="h-20"
                        styles="text-xl" />
                )}

                <h5 className='text-gray-950 font-medium leading-6'>
                    {user?.fullName || ""}
                </h5>
            </div>

            {SIDE_MENU_DATA.map((item, index) => (
                <button
                    key={`menu_${index}`}
                    className={`w-full flex items-center gap-4 text-[15px] p-2 rounded-lg mb-3 py-3 px-6 cursor-pointer ${activeMenu === item.label ? 'text-white bg-primary' : ''}`}
                    onClick={() => handleClick(item.path, item.label)}
                >
                    <item.icon className='text-xl' />
                    <span>{item.label}</span>
                </button>
            ))}
        </div>
    )
}

export default SideMenu
