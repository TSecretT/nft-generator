import React from 'react';
import Lottie from 'react-lottie';
import animationData from '../assets/spinner.json';

export const LoadingModal = ({text}: any) => {


    const defaultOptions = {
        loop: true,
        autoplay: true, 
        animationData,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return (
        <div className="container">
            <Lottie
                options={defaultOptions}
                height={200}
                width={200}
            />
            <span style={{ margin: 50 }}>{text}</span>
        </div>
    )
}

export default LoadingModal;