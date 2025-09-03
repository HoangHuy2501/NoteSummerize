import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom';
import { Toaster } from "sonner";
import './index.css'
import App from './App.jsx'
// import Ant Design CSS
import 'antd/dist/reset.css'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Background chung */}
    <div className="relative min-h-screen bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
      
      {/* Aurora mờ ảo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] 
                        bg-[radial-gradient(circle,_rgba(255,255,255,0.2)_0%,transparent_70%)] 
                        blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] 
                        bg-[radial-gradient(circle,_rgba(255,255,255,0.15)_0%,transparent_70%)] 
                        blur-3xl pointer-events-none"></div>
      </div>

      {/* Noise overlay */}
      <div className="absolute inset-0 
                      bg-[radial-gradient(white_1px,transparent_1px)] 
                      bg-[length:20px_20px] opacity-5 pointer-events-none"></div>

      {/* App */}
      <HashRouter>
        <App />
        <Toaster position="top-right" richColors />
      </HashRouter>
    </div>
  </StrictMode>
)
