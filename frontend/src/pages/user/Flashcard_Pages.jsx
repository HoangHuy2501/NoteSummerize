import React from 'react';
import InformationAndStatus from '../../components/Flashcard/InformationAndStatus';
import Multiple_choice from '../../components/Flashcard/Multiple_choice';
import { Button } from 'antd';
import { useParams } from 'react-router-dom';
import Back from '../../components/Back';
Flashcard_Pages.propTypes = {
    
};

function Flashcard_Pages() {
    const {id}=useParams()
    return (
        <div>
            <div className='w-full flex gap-8'>
                <div className='w-1/4 h-min '>
                <div className='mt-5 ml-4'>
                <Back />
            </div>
                    <InformationAndStatus note_id={id} />
                </div>
                <div className='w-3/4 overflow-y-auto max-h-screen'>
                    <h2 className='uppercase text-center mt-20 text-4xl '>exercise</h2>
                    <div className='border border-cyan-300 h-min pl-6 mr-3  bg-[#0a0f1f]/60 backdrop-blur-sm shadow-xl rounded-xl'>
                        <Multiple_choice Note_id={id} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Flashcard_Pages;