import React, { useEffect } from 'react';
import Img from '../assets/banner_fish.png';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
const BannerHome = () => {
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language; 
    useEffect(()=>{
      window.document.dir = i18n.dir();
    },[currentLanguage])
  return (
    <div
      className={`flex flex-col md:flex-row ${i18n.dir() === 'rtl' ? 'md:flex-row-reverse' : ''} items-center justify-between py-5 px-4 md:px-35 font-Poppins gap-8`}
      dir={i18n.dir()} >
      <div className={`flex flex-col items-center md:items-start text-center md:text-left gap-4 md:gap-6 ${i18n.dir() === 'rtl' ? 'md:items-end md:text-right' : ''}`}>
        <h1 className="text-md sm:text-2xl/[1.8] md:text-3xl/[1.8] lg:text-5xl/[1.8] font-extrabold text-white tracking-wide leading-snug md:leading-tight drop-shadow-lg">
          {t('HeroTitle')}
        </h1>
        <h2 className="text-sm sm:text-base md:text-[17px] lg:text-lg text-white font-semibold drop-shadow-md">
          {t('HeroP')}
        </h2>
        <div className="mt-4">
          <Link to="/SeaFood">
            <button className={`flex items-center justify-center gap-2 w-40 sm:w-48 md:w-52 h-12 md:h-14 bg-[#00356659] text-white text-sm sm:text-base md:text-lg font-extrabold rounded-full hover:bg-[#003566aa] transition duration-300 ${i18n.dir() === 'rtl' ? 'flex-row-reverse' : ''}`}>
              {t('shopBtn')}<ArrowRight className="w-4 h-4 md:w-5 md:h-5" />  
            </button>
          </Link>
        </div>
      </div>
      <div className="mt-6 md:mt-0 flex justify-center md:justify-end w-full">
        <img
          src={Img}
          alt="Seafood"
          className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl"
        />
      </div>
    </div>
  );
}

export default BannerHome;
