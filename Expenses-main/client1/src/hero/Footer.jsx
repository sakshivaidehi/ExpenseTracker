import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
    return (
        <div className='bg-[#0F172A] text-gray-300 pt-8 px-6 md:px-16 lg:px-24 xl:px-32'>
            <div className='flex flex-wrap justify-between gap-12 md:gap-6'>
                <div className='max-w-80 w-full md:w-auto'>
                    <img src={assets.logo} alt="logo" className='mb-4 h-8 md:h-9 invert opacity-80' />
                    <p className='text-sm'>
                        Discover your money’s story, from daily spends to monthly trends, powered by AI insights that help you save smarter.
                    </p>
                    <div className='flex items-center gap-3 mt-4'>
                        <img src={assets.instagramIcon} alt="instagram-icon" className='w-6' />
                        <img src={assets.facebookIcon} alt="facebook-icon" className='w-6' />
                        <img src={assets.twitterIcon} alt="twitter-icon" className='w-6' />
                        <img src={assets.linkendinIcon} alt="linkedin-icon" className='w-6' />
                    </div>
                </div>

                <div className='w-full md:w-auto'>
                    <p className='font-playfair text-lg text-gray-800'>COMPANY</p>
                    <ul className='mt-3 flex flex-col gap-2 text-sm'>
                        <li><a href="#">About</a></li>
                        <li><a href="#">Careers</a></li>
                        <li><a href="#">Press</a></li>
                        <li><a href="#">Blog</a></li>
                        <li><a href="#">Partners</a></li>
                    </ul>
                </div>

                <div className='w-full md:w-auto'>
                    <p className='font-playfair text-lg text-gray-800'>SUPPORT</p>
                    <ul className='mt-3 flex flex-col gap-2 text-sm'>
                        <li><a href="#">Help Center</a></li>
                        <li><a href="#">Safety Information</a></li>
                        <li><a href="#">Cancellation Options</a></li>
                        <li><a href="#">Contact Us</a></li>
                        <li><a href="#">Accessibility</a></li>
                    </ul>
                </div>

                <div className='max-w-80 w-full md:w-auto'>
                    <p className='font-playfair text-lg text-gray-800'>STAY UPDATED</p>
                    <p className='mt-3 text-sm'>
                        Join our newsletter for AI forecasts, saving tips, and high-spend alerts.
                    </p>
                    <div className='flex items-center mt-4'>
                        <input type="text" className='bg-white rounded-l border border-gray-300 h-9 px-3 outline-none' placeholder='Your email' />
                        <button className='flex items-center justify-center bg-black h-9 w-9 aspect-square rounded-r'>
                            <img src={assets.arrowIcon} alt="arrow-icon" className='w-3.5 invert' />
                        </button>
                    </div>
                </div>
            </div>
            <hr className='border-gray-700 mt-8' />
            <div className='flex flex-col md:flex-row gap-2 items-center justify-between py-5 text-gray-300'>
                <p>© {new Date().getFullYear()} ExpenseIQ. All rights reserved.</p>
                <ul className='flex items-center gap-4'>
                    <li><a href="#">Privacy</a></li>
                    <li><a href="#">Terms</a></li>
                    <li><a href="#">Sitemap</a></li>
                </ul>
            </div>
        </div>
    )
}

export default Footer;