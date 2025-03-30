import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";


const images = [
    "greenish.avif",
    "plant.avif",
    "maize.jpg",
    "wheatimage.jpg",
    "replace.jpg",
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full relative">
      {/* Swiper for image sliding */}
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        className="h-full w-full"
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <img 
              src={`../public/assets/${img}`}
              alt="crop"
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Button to redirect */}
      <button
        onClick={() => navigate("/predict")}
        className="absolute z-10 bottom-10 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg text-xl font-bold shadow-lg hover:bg-green-700 transition cursor-pointer"
      >
        Get Started
      </button>
    </div>
  );
}
