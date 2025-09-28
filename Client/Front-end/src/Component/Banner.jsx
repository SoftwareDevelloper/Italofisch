import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const Banner = () => {
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language; 
    useEffect(()=>{
      window.document.dir = i18n.dir();
    },[currentLanguage])
  return (
    <div className='flex justify-center items-center bg-[#90e1ef4a] border-none px-2.5 py-5 flex-col text-center md:flex-col  md:px-3 font-Poppins'>
        <h1 className='text-base sm:text-lg/loose md:text-xl/loose lg:text-3xl/loose font-extrabold text-white tracking-wide leading-snug md:leading-tight drop-shadow-lg'> {t('titleBanner')} </h1>
        <Link to="/SeaFood" className='mt-5'>
          <button
            className={`flex items-center justify-center gap-2 w-56 sm:w-52 md:w-52 lg:w-60 h-12 md:h-14 bg-[#00356659] text-white text-sm sm:text-base md:text-lg font-extrabold rounded-full transition duration-300 cursor-pointer
              ${i18n.dir() === 'rtl' ? 'flex-row-reverse' : 'flex-row'} 
              hover:bg-[#003566aa]`}
          >
            {t('shopBtn')}
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5"/>
          </button>
      </Link>
    </div>
  )
}

export default Banner
