import { useState,useEffect } from "react";

function AdCarousel() {
  const ads = [
   "src/assets/0tbi8w.jpg",
   "src/assets/1756624415_699135.png",
   "src/assets/document_7198_p8_20211012142423.jpg"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, 5000); // เปลี่ยนภาพทุก 3 วิ
    return () => clearInterval(interval);
  }, [ads.length]);

  return (
    <div className="relative w-full h-120 flex items-center justify-center">
      {/* รูปโฆษณา */}
      <img
        src={ads[currentIndex]}
        alt="ad"
        className="w-full h-full object-cover rounded-xl transition-all duration-700 ease-in-out"
      />

      {/* จุดแสดงสถานะภาพ */}
      <div className="absolute bottom-2 flex gap-2">
        {ads.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all ${
              i === currentIndex ? "bg-green-400" : "bg-gray-500"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default AdCarousel;
