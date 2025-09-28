import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom'
const Item = (props) => {
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language; 
    useEffect(()=>{
      window.document.dir = i18n.dir();
    },[currentLanguage])
  return (
    <div className="flex flex-col items-center bg-transparent border border-gray-200 rounded-lg shadow-md p-4 w-full max-w-sm h-[500px] text-white font-Poppins transition-transform duration-200 hover:-translate-y-2">
      <div className="w-full">
        <Link to={`/Detail/${props.id}`}>
          <img
            src={props.image}
            alt={props.name}
            className="w-full h-52 object-cover rounded-lg"
          />
        </Link>
      </div>
      <span className="text-2xl sm:text-3xl font-bold leading-relaxed mt-3">
        {props.name}
      </span>
      <p className="text-base sm:text-sm lg:text-[15px] md:text-[15px] font-semibold text-center flex-grow overflow-hidden leading-relaxed mt-2">
        {props.description}
      </p>
      <div className="flex justify-between items-center w-full text-lg font-bold mt-4">
        <span className="text-[#002950] font-extrabold relative after:content-[''] after:block after:w-full after:h-[3px] after:bg-[#002950] after:rounded">
          {props.weight} Kg
        </span>
        <span className="text-[#002950] font-extrabold mr-2">
          {props.price} €
        </span>
      </div>
      <button
        className="bg-[#004468c8] w-44 h-12 mt-4 rounded text-white text-base font-semibold hover:bg-[#003450] transition"
        onClick={props.onAddToCart}
      >
        {t('AddBtn')}
      </button>
    </div>
  )
}

export default Item
