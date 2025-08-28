import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { verifyApi } from '../../services/auth';
import Loading from '../../components/Loading';
import { toast } from 'sonner';
// import PropTypes from 'prop-types';

Verify.propTypes = {
    
};

function Verify() {
    const nativige=useNavigate();
    const [searchParams]=useSearchParams();
    const token=searchParams.get('token');
    const [loading,setLoading]=useState(false);
    const handleVerify=async (e)=>{
        e.preventDefault();
        try {
            setLoading(true);
            const res=await verifyApi(token);
            if(res.success){
                toast.success(res.message);
                setTimeout(() => {
                    nativige('/auth/login');
                }, 2000);
            }else{
                toast.error(res.message);
            }
        } catch  {
            toast.error("Có lỗi xảy ra!");
        }finally{
            setLoading(false);
        }
    }
    return (
        <div>
            <div>
                {loading===true && <Loading />}
            </div>
        <div className='relative z-10 min-h-screen flex items-center justify-center'>
          <div className='w-2/3 p-8 rounded-2xl text-white  backdrop-blur-md border border-white/10 '>
            <h2 className='text-3xl font-bold mb-10'>Hello,</h2>
            
                <p className='mb-10 text-2xl'>To continue creating your new account in software AI note summarize. please onclick verify my email address to register account.</p>
           
            <button onClick={handleVerify} className=' px-8 py-3 rounded-lg 
                   font-semibold text-white 
                   bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 
                   hover:from-purple-600 hover:to-cyan-400 
                   shadow-lg shadow-cyan-500/30 
                   transition-all duration-300 
                   mx-auto block '>Verify my email address</button>
        </div>
      </div>
        </div>
    );
}

export default Verify;