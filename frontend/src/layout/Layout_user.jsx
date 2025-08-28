import React from 'react';
import { Outlet } from "react-router-dom";
import Sidebar from '../components/Sidebar_User_components'
Layout_user.propTypes = {
    
};

function Layout_user() {
    return (
        <div className='flex min-h-screen'>
            <div className='w-1/6
      bg-gray-900/50 backdrop-blur-md 
      border-r border-gray-700/50
      text-white flex flex-col gap-2 p-4
      shadow-lg'> <Sidebar /> </div>
            <div className='w-5/6 text-white overflow-y-auto max-h-screen '>
                <Outlet />
            </div>
        </div>
    );
}

export default Layout_user;