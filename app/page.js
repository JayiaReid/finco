import Image from "next/image";
import Header from "./_components/Header";
import Lpage from "./_components/Lpage";

export default function Home() {
  return (
    <div>
      <div className='h-screen w-screen absolute top-0 z-0'>
        <video autoPlay loop muted playsInline className='h-full w-full object-cover'>
          <source src='/video.mp4' />
        </video>
      </div>
      <div className="relative z-10">
        <Header />
      <Lpage />
      </div>
      
    </div>
  );
}
