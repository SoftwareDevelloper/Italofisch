import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next';

const NewsLetter = () => {
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language; 
    useEffect(()=>{
      window.document.dir = i18n.dir();
    },[currentLanguage])
  return (
    <div
      id="Contact"
      className="flex flex-col justify-center items-center bg-blue-50/30 rounded-xl px-4 md:px-20 py-10 text-center space-y-4 font-Poppins h-[40vh]"
    >
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0077b6]">
       {t('susbcribeTitle')}
      </h2>
      <p className="text-base sm:text-lg md:text-xl font-bold text-[#313131]">
       {t('subscribeP')}
      </p>

      <div className="relative w-full max-w-lg mt-4">
        <input
          type="email"
          placeholder={t('emailInput')}
          className="w-full pr-32 py-3 pl-5 border-2 border-[#0077b6] rounded-full outline-none text-sm md:text-base font-semibold text-[#003566]"
        />
        <button className="absolute top-1/2 right-0 -translate-y-1/2 px-9 py-3 bg-[#0077b6] text-white font-semibold rounded-full text-sm md:text-base transition duration-300 hover:bg-blue-700 hover:scale-105">
          {t('subscribe')}
        </button>
      </div>
    </div>
  )
}

export default NewsLetter
