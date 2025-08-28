import React from 'react';
import { Outlet } from "react-router-dom";

function Layout_Auth() {
  return (
    <div className="relative z-10 flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 rounded-2xl 
                      bg-black/60 backdrop-blur-md 
                      border border-white/10 text-center overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout_Auth;
