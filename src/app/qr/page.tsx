// app/qr/page.tsx
'use client';
import { QRCodeSVG } from 'qrcode.react';

export default function QRPage() {
  return (
    <main className="h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-2xl font-bold mb-4">📱 Scan to Submit Your Karaoke Song</h1>
      <QRCodeSVG value="https://your-domain.com/submit" size={220} />
    </main>
  );
}
