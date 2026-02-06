import React from "react";
import Testimonial from "./Testimonial";
const Hero = () => {
    return (
        <>
            <div className='flex flex-col items-start justify-center px-6 md:px-16 lg:px-24 xl:px-32 text-white bg-[url("/src/assets/h2.jpg")] bg-no-repeat bg-cover bg-center h-screen'>
                <p className='bg-[#49B9FF]/50 px-3.5 py-1 rounded-full mt-20'>
                    The Ultimate AI Powered Money Saving
                </p>

                <h1 className='font-playfair text-2xl md:text-5xl md:text-[56px] md:leading-[56px] font-bold md:font-extrabold max-w-xl mt-4'>
                    Find your perfect financial rhythm ExpenseIQ keeps your spending in sync.
                </h1>

                <p className='max-w-130 mt-2 text-sm md:text-base'>
                    Discover your smartest money path — track, predict, and save with AI.
                </p>
                <p className='max-w-130 mt-2 text-sm md:text-base'>
                    Track smarter, save better — ExpenseIQ predicts your next month before you spend it.
                </p>
            </div>
            <Testimonial />
        </>
    );
};

export default Hero;
