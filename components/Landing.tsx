import Image from "next/image";
import Button from "./Button";

const Landing = () => {
  return (
    <section className="sticky top-[72px] mx-auto flex h-[calc(100vh-72px)] max-w-[1350px] items-center justify-between px-8">
      <div className="space-y-8">
        {/* el h1 son los 3 span */}
        <h1 className="space-y-3 text-5xl font-semibold tracking-wide lg:text-6xl xl:text-7xl">
          {/* block es display:block luego son spans de bloque */}
          {/* para que la propiedad background-clip:text se aplique el text tiene que estar en transparent(mete el fondo al texto) */}
          <span className="block bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
            Powered
          </span>
          <span className="block">By Intellect</span>
          <span className="block">Driven By Values</span>
        </h1>
        <div className="space-x-8">
          <Button title="Buy Now" />
          <a className="link">Learn More</a>
        </div>
      </div>
      <div className="relative hidden h-[450px] w-[450px] transition-all duration-500 md:inline lg:h-[650px] lg:w-[600px]">
        <Image src="/images/iphone.png" fill style={{ objectFit: "contain" }} alt="mobile-img" />
      </div>
    </section>
  );
};
export default Landing;
