import React from 'react';
import { NavLink } from 'react-router-dom';
import { logout } from '../services/auth';
import { toast } from 'sonner';
Sidebar_User_components.propTypes = {
    
};

function Sidebar_User_components() {
    const sidebar=[
        {
            id: 1,
            title: "Dashboard",
            path: "/dashboard"
        },{
            id: 2,
            title: "Profile",
            path: "/profile"
        },
        {
            id:3,
            title: "Notes",
            path: "/notes"
        },{
            id: 4,
            title: "Friends",
            path: "/friends"
        },{
            id: 5,
            title: "Message",
            path: "/message"
        }
    ];
    const sidebarUnder=[
        {
            id: 9,
            title: "Settings",
            path: "/settings"
            
        },{
            id: 10,
            title: "Logout",
            path: "/auth/login"
        }
    ]
    const getImage=localStorage.getItem("image");
    //logout
    const handleLogout = async (id) => {
        try {
            if(id!==10) return;
            const response = await logout();
            if (response.success===true) {
                window.location.href = "/auth/login";
                localStorage.clear();
                // toast.success("Đăng xuất thành công!");
                
            }
        } catch {
            toast.error("Đã xảy ra lỗi khi đăng xuất!");
        }
        // window.location.href = "/auth/login";
    };
    return (
        <div className=' flex flex-col gap-4 text-center h-full '>
        <h2 className='text-cyan-200 font-semibold mt-5 '>AI NOTES SUMMARIZED</h2>
        <div>
            <img src={getImage?getImage:"../../public/avatar.jpg"} alt="User Avatar" className="w-20 h-20 rounded-full mx-auto" />
        </div>
            {sidebar.map((item)=>( 
                <NavLink className={({isActive})=>`w-full p-2 cursor-pointer  lg:text-2xl ${isActive?"text-cyan-400":"text-gray-300"} hover:text-cyan-400`}
                 key={item.id} to={item.path}>{item.title}</NavLink>
            ))}
            <div className='mt-auto border-t-2 flex flex-col gap-4'>
                {sidebarUnder.map((item)=>( 
                <NavLink className={({isActive})=>`w-full p-2 cursor-pointer  lg:text-2xl ${isActive?"text-cyan-400":"text-gray-300"} hover:text-cyan-400`}
                onClick={() =>  handleLogout(item.id)} key={item.id} to={item.path}>{item.title}</NavLink>
            ))}
            </div>
        </div>
            
        
    );
}

export default Sidebar_User_components;