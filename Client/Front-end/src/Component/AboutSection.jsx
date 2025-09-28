import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next';

const AboutSection = () => {
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language; 
    useEffect(()=>{
      window.document.dir = i18n.dir();
    },[currentLanguage])
  return (
    <div id="About" className="flex flex-col md:flex-row justify-between items-center bg-transparent min-h-screen  gap-24 px-4 md:px-20 py-10 font-Poppins">
      <div className="w-full md:w-1/3 mb-10 md:mb-0 text-center md:text-left ">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg">
          {t('AboutTitle')}
        </h1>
      </div>
      <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-2">
        <div className="bg-white/30 rounded-lg p-4 text-[#003566] text-center transition-transform transform hover:scale-105 hover:shadow-lg">
          <h2 className="text-xl sm:text-2xl font-extrabold mb-2"> {t('Feature1Title')}</h2>
          <p className="text-sm sm:text-base font-medium leading-relaxed">
           {t('Feature1Desc')}
          </p>
        </div>
        <div className="bg-white/30 rounded-lg p-4 text-[#003566] text-center transition-transform transform hover:scale-105 hover:shadow-lg">
          <h2 className="text-xl sm:text-2xl font-extrabold mb-2">{t('Feature2Title')}</h2>
          <p className="text-sm sm:text-base font-medium leading-relaxed">
            {t('Feature2Desc')}
          </p>
        </div>
        <div className="bg-white/30 rounded-lg p-4 text-[#003566] text-center transition-transform transform hover:scale-105 hover:shadow-lg">
          <h2 className="text-xl sm:text-2xl font-extrabold mb-2">{t('Feature3Title')}</h2>
          <p className="text-sm sm:text-base font-medium leading-relaxed">
           {t('Feature3Desc')}
          </p>
        </div>
        <div className="bg-white/30 rounded-lg p-4 text-[#003566] text-center transition-transform transform hover:scale-105 hover:shadow-lg">
          <h2 className="text-xl sm:text-2xl font-extrabold mb-2">{t('Feature4Title')}</h2>
          <p className="text-sm sm:text-base font-medium leading-relaxed">
           {t('Feature4Desc')}
          </p>
        </div>
      </div>
    </div>
  )
}

export default AboutSection
