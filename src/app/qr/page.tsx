// app/qr/page.tsx
'use client';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';

export default function QRPage() {
  const [qrSize, setQrSize] = useState(180);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 640) {
        setQrSize(100);
      } else {
        setQrSize(180);
      }
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <main className="h-screen flex flex-col justify-between items-center bg-black text-white px-2 py-2">
      <div className="w-full flex flex-col items-center mt-2">
        <h1 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-4 text-center">📱 Scan to Submit Your Karaoke Song</h1>
        <p className="text-xs sm:text-base text-purple-200 mb-2 text-center">Unleash your inner superstar! Join the fun, submit your song, and sing your heart out.</p>
      </div>
      <div className="flex flex-col items-center justify-center flex-1 w-full">
        {/* Show QR code only on sm and up, otherwise show a message */}
        <div className="hidden sm:flex flex-col items-center">
          <QRCodeSVG value="https://your-domain.com/submit" size={qrSize} />
          <span className="text-xs sm:text-sm mt-2 text-purple-300">Scan to Submit Your Song</span>
        </div>
        <div className="flex sm:hidden flex-col items-center justify-center w-full">
          <span className="text-base text-purple-300 text-center">QR code is only available on larger screens.<br/>Open this page on a tablet or desktop to scan.</span>
        </div>
      </div>
      <div className="h-4" />
    </main>
  );
}
