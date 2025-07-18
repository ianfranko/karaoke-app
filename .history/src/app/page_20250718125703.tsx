// app/page.tsx
export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center p-10 bg-black text-white">
      <h1 className="text-4xl font-bold mb-4">🎤 Welcome to Karaoke Jam</h1>
      <p className="text-lg">Scan the QR to submit your song, or view the live queue!</p>
    </main>
  );
}
