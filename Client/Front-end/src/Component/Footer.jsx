import React, { useEffect } from 'react'
import Logo from '../assets/logo.png'
import { Mail, Phone, MapPinHouse } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const Footer = () => {
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language; 
    useEffect(()=>{
      window.document.dir = i18n.dir();
    },[currentLanguage])
  return (
    <footer className="bg-transparent text-white font-Poppins shadow-md py-10 px-4">
      <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 items-center justify-center gap-10 ">
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-4">
          <img src={Logo} alt="Italo Fish" className="w-24 h-auto" />
          <h2 className="text-2xl font-extrabold tracking-wider"> {t('logo')} </h2>
          <p className="text-base font-medium"> {t('footerTitle')} </p>
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-bold relative after:block after:w-1/5 after:h-1 after:rounded after:bg-[#0077b6] after:mt-1">
            {t('contact')}
          </h3>
          <p className="flex items-center gap-2 text-base font-medium"><Mail className="w-4 h-4 " /> support@italofish.com</p>
          <p className="flex items-center gap-2 text-base font-medium"><Phone className="w-4 h-4" /> +39 091 765 4321</p>
          <p className="flex items-center gap-2 text-base font-medium"><MapPinHouse className="w-4 h-4" /> Via Roma, 145 — 90133 Palermo, Sicilia, Italia</p>
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-bold relative after:block after:w-1/5 after:h-1 after:rounded after:bg-[#0077b6] after:mt-1">
            {t('follow')}
          </h3>
          <div className="flex gap-4 mt-2">
            <a href="#" className="flex items-center justify-center w-10 h-10 bg-[#1e3552] rounded-full hover:bg-[#00c6ff] transition-transform duration-300 transform hover:-translate-y-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                <path d="M22.675 0h-21.35c-.733 0-1.325.592-1.325 1.325v21.351c0 .733.592 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.672c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.794.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.312h3.587l-.467 3.622h-3.12v9.293h6.116c.732 0 1.324-.591 1.324-1.324v-21.35c0-.733-.592-1.325-1.325-1.325z"/>
              </svg>
            </a>
            <a href="#" className="flex items-center justify-center w-10 h-10 bg-[#1e3552] rounded-full hover:bg-[#00c6ff] transition-transform duration-300 transform hover:-translate-y-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.723-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-2.717 0-4.92 2.203-4.92 4.918 0 .386.044.762.128 1.124-4.09-.205-7.719-2.164-10.148-5.144-.424.725-.666 1.562-.666 2.457 0 1.695.863 3.191 2.174 4.07-.802-.026-1.558-.246-2.218-.616v.062c0 2.367 1.684 4.342 3.918 4.788-.41.112-.842.171-1.287.171-.314 0-.615-.03-.911-.086.616 1.924 2.403 3.323 4.52 3.36-1.656 1.298-3.744 2.073-6.017 2.073-.39 0-.779-.023-1.161-.067 2.141 1.374 4.684 2.174 7.418 2.174 8.902 0 13.771-7.372 13.771-13.771 0-.21-.005-.42-.014-.629.946-.683 1.768-1.54 2.416-2.515z"/>
              </svg>
            </a>
            <a href="#" className="flex items-center justify-center w-10 h-10 bg-[#1e3552] rounded-full hover:bg-[#00c6ff] transition-transform duration-300 transform hover:-translate-y-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.056 1.97.24 2.428.403a4.92 4.92 0 0 1 1.77 1.03 4.918 4.918 0 0 1 1.03 1.77c.163.458.347 1.258.403 2.428.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.056 1.17-.24 1.97-.403 2.428a4.918 4.918 0 0 1-1.03 1.77 4.918 4.918 0 0 1-1.77 1.03c-.458.163-1.258.347-2.428.403-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.056-1.97-.24-2.428-.403a4.918 4.918 0 0 1-1.77-1.03 4.92 4.92 0 0 1-1.03-1.77c-.163-.458-.347-1.258-.403-2.428-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.056-1.17.24-1.97.403-2.428a4.918 4.918 0 0 1 1.03-1.77 4.918 4.918 0 0 1 1.77-1.03c.458-.163 1.258-.347 2.428-.403 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.257 0-3.667.012-4.947.072-1.28.059-2.156.27-2.91.57a7.074 7.074 0 0 0-2.568 1.66 7.072 7.072 0 0 0-1.66 2.568c-.3.754-.511 1.63-.57 2.91-.06 1.28-.072 1.69-.072 4.947s.012 3.667.072 4.947c.059 1.28.27 2.156.57 2.91a7.074 7.074 0 0 0 1.66 2.568 7.072 7.072 0 0 0 2.568 1.66c.754.3 1.63.511 2.91.57 1.28.06 1.69.072 4.947.072s3.667-.012 4.947-.072c1.28-.059 2.156-.27 2.91-.57a7.072 7.072 0 0 0 2.568-1.66 7.074 7.074 0 0 0 1.66-2.568c.3-.754.511-1.63.57-2.91.06-1.28.072-1.69.072-4.947s-.012-3.667-.072-4.947c-.059-1.28-.27-2.156-.57-2.91a7.074 7.074 0 0 0-1.66-2.568 7.072 7.072 0 0 0-2.568-1.66c-.754-.3-1.63-.511-2.91-.57-1.28-.06-1.69-.072-4.947-.072z"/>
                <path d="M12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998z"/>
                <circle cx="18.406" cy="5.594" r="1.44"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white border-opacity-20 mt-10 pt-5 text-center opacity-90 text-base font-medium">
        &copy;{t('copyright')}
      </div>
    </footer>
  )
}

export default Footer
