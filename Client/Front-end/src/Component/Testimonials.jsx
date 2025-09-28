import React, { useEffect } from "react";
import Slider from "react-slick";
import User from "../assets/icons8-person-64.png";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const testimonials = {
  en: [
    { text: "Great service and fast delivery!", name: "John D." },
    { text: "Quality products at affordable prices.", name: "Sarah K." },
    { text: "Excellent customer support.", name: "Mike L." },
    { text: "Fresh seafood every time!", name: "Emily R." },
  ],
  fr: [
    { text: "Service excellent et livraison rapide !", name: "John D." },
    { text: "Produits de qualité à prix abordables.", name: "Sarah K." },
    { text: "Support client excellent.", name: "Mike L." },
    { text: "Des fruits de mer frais à chaque fois !", name: "Emily R." },
  ],
  ar: [
    { text: "خدمة رائعة وتسليم سريع!", name: "جون د." },
    { text: "منتجات عالية الجودة بأسعار معقولة.", name: "سارة ك." },
    { text: "دعم عملاء ممتاز.", name: "مايك ل." },
    { text: "المأكولات البحرية طازجة في كل مرة!", name: "إميلي ر." },
  ],
};

const NextArrow = ({ onClick }) => (
  <button
    className="absolute top-1/2 right-2 transform -translate-y-1/2 z-10 bg-white bg-opacity-50 hover:bg-opacity-80 p-2 rounded-full"
    onClick={onClick}
  >
    <ChevronRight className="w-6 h-6 text-blue-900" />
  </button>
);

const PrevArrow = ({ onClick }) => (
  <button
    className="absolute top-1/2 left-2 transform -translate-y-1/2 z-10 bg-white bg-opacity-50 hover:bg-opacity-80 p-2 rounded-full"
    onClick={onClick}
  >
    <ChevronLeft className="w-6 h-6 text-blue-900" />
  </button>
);

const Testimonials = () => {
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language; 
    const currentTestimonials = testimonials[i18n.language] || testimonials.en;
    useEffect(()=>{
      window.document.dir = i18n.dir();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[currentLanguage])
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
    appendDots: dots => (
      <div>
        <ul className="flex justify-center gap-2 mt-4">{dots}</ul>
      </div>
    ),
    // eslint-disable-next-line no-unused-vars
    customPaging: i => (
      <div className="w-3 h-3 bg-white rounded-full opacity-50 hover:opacity-100 cursor-pointer"></div>
    ),
  };

  return (
    <div className="flex flex-col items-center justify-center text-center px-4 py-12 mx-auto max-w-6xl">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-8 drop-shadow-lg relative">
       {t('testimonials')}
        <span className="block w-1/3 h-1 bg-[#003566] rounded mt-2 mx-auto"></span>
      </h1>

      <Slider {...settings} className="w-full">
        {currentTestimonials.map((testimonial, idx) => (
          <div key={idx} className="px-2">
            <div className="flex flex-col items-center justify-center p-6 bg-[#0035666d] rounded-2xl text-white min-h-[180px] hover:-translate-y-2 transition-transform duration-300">
              <p className="text-sm sm:text-base md:text-lg font-semibold tracking-wide drop-shadow">
                "{testimonial.text}"
              </p>
              <div className="flex items-center gap-3 mt-3">
                <img
                  src={User}
                  alt="user profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <h3 className="text-base sm:text-lg font-bold drop-shadow">
                  - {testimonial.name}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Testimonials;
