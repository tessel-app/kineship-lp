import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
// Desktop images
import screen1 from '../assets/appscreens/browser/brow-1.png';
import screen2a from '../assets/appscreens/browser/brow-2a.png';
import screen2b from '../assets/appscreens/browser/brow-2b.png';
import screen2c from '../assets/appscreens/browser/brow-2c.png';
import screen3 from '../assets/appscreens/browser/screen-3.png';
import screen4 from '../assets/appscreens/browser/screen-4.png';
// Mobile images (same names, different path)
import mobileScreen1 from '../assets/appscreens/mobile/test-1.svg';
import mobileScreen2 from '../assets/appscreens/mobile/test-2.svg';
import mobileScreen3 from '../assets/appscreens/mobile/test-3.svg';
import mobileScreen4 from '../assets/appscreens/mobile/test-4.svg';

const desktopScreenshots = [screen1, screen2a, screen2b, screen2c, screen3, screen4];
const mobileScreenshots = [mobileScreen1, mobileScreen2, mobileScreen3, mobileScreen4];


export default function AppScreenshots() {
  const [currentIndex, setCurrentIndex] = useState(-1);  // Start with nothing showing
  const [hasStarted, setHasStarted] = useState(false);  // Track if we've started the sequence
  const [isMobile, setIsMobile] = useState(false);

  // Initial delay to sync with kineship title
  useEffect(() => {
    const initialDelay = setTimeout(() => {
      setCurrentIndex(0);  // Show first slide
      setHasStarted(true); // Mark that we've started
    }, 3900);  // 1.2s (question delay) + 6s (question animation) + 0.3s buffer

    return () => clearTimeout(initialDelay);
  }, []);

  // Main interval for transitions
  useEffect(() => {
    if (hasStarted) {  // Removed the !isMobile check so it runs for both
      const timer = setInterval(() => {
        setCurrentIndex((current) => (current + 1) % (isMobile ? mobileScreenshots.length : desktopScreenshots.length));
      }, 
        isMobile ? (
          currentIndex === 0 ? 2000 :  // Slide 1: 2s
          currentIndex === 1 ? 3000 :  // Slide 2: 3s
          currentIndex === 2 ? 3500 :  // Slide 3: 3.5s
          3500                         // Slide 4: 3.5s
        ) : (
          currentIndex === 0 ? 2500 :    // brow-1: moderate
          currentIndex === 1 ? 1500 :    // brow-2a: quick
          currentIndex === 2 ? 1500 :    // brow-2b: quick
          currentIndex === 3 ? 1500 :    // brow-2c: quick
          4500                           // screen-3 and screen-4: longer
        )
      );
      
      return () => clearInterval(timer);
    }
  }, [isMobile, currentIndex, hasStarted]);

  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = 
        window.matchMedia('(max-width: 1024px)').matches ||
        window.matchMedia('(hover: none) and (pointer: coarse)').matches;
      setIsMobile(isMobileDevice);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className={`relative [transform:translateZ(0)] ${isMobile ? 'h-[430px]' : 'h-[510px]'} overflow-hidden`}>
      <img 
        src={isMobile ? mobileScreenshots[0] : desktopScreenshots[0]} 
        alt="" 
        className="invisible"
        aria-hidden="true"
        style={{ imageRendering: 'crisp-edges' }}
      />
      
      <div className="absolute top-0 left-0 right-0">
        {(isMobile ? mobileScreenshots : desktopScreenshots).map((screenshot, index) => (
          <motion.img
            key={index}
            src={screenshot}
            alt={`App Screenshot ${index + 1}`}
            className={`rounded-[20px] shadow-2xl absolute top-0 left-0 origin-center w-full ${
              isMobile ? 'h-[430px]' : 'h-[510px]'
            } object-contain mix-blend-normal`}
            style={{ imageRendering: 'crisp-edges' }}
            initial={{
              opacity: 0
            }}
            animate={{ 
              opacity: index === currentIndex ? 1 : 0
            }}
            transition={{ 
              duration: 1.5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  );
}