import Image from "next/image";
import { ModeToggle } from "../components/ui/Toggle";
import  MoonModel  from "../components/MoonModel";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <main className="flex min-h-screen max-w-md flex-col m-auto items-center gap-8">
      <Navbar/>
      <div className="z-10 w-full items-center justify-between text-sm lg:flex">
        <h1 className="tracking-[0.6em] text-xl md:text-3xl font-bold uppercase text-center">Phase Name</h1>
        <h2 className="tracking-[0.6em] text-md md:text-xl font-bold uppercase text-center mt-8">Days In Phase</h2>
      </div>
      {/* <Image src="/default.png" alt="default img" width={300} height={200} className="m-auto"/> */}
      <MoonModel />
      <article className="w-full flex justify-between px-8 text-xs md:text-lg uppercase tracking-[0.8em] font-semibold text-neutral-500">
        <div>
          <h3>Previous</h3>
          <p className="text-neutral-800 text-sm">Phase</p>
        </div>
        <div>
          <h3>Next</h3>
          <p className="text-neutral-800 text-sm">Phase</p>
        </div>
      </article>
      
      <article className="flex justify-around w-full font-bold text-neutral-300 px-8 mt-4">
        <div className="flex flex-col items-center">
          <Image src="/full-sm.png" width={40} height={40} alt="phase name"/>
          <p>M</p>
        </div>
        <div className="flex flex-col items-center">
          <Image src="/full-sm.png" width={40} height={40} alt="phase name"/>
          <p>M</p>
        </div>
        <div className="flex flex-col items-center">
          <Image src="/full-sm.png" width={40} height={40} alt="phase name"/>
          <p>M</p>
        </div>
        <div className="flex flex-col items-center">
          <Image src="/full-sm.png" width={40} height={40} alt="phase name"/>
          <p>M</p>
        </div>
        <div className="flex flex-col items-center">
          <Image src="/full-sm.png" width={40} height={40} alt="phase name"/>
          <p>M</p>
        </div>
      </article>

      <div className="w-full h-72 bg-neutral-200 transform skew-y-[-12deg] origin-top-right mt-8 self-end flex flex-col gap-6 items-end text-right pt-10 pr-4  dark:text-black">
        <div className="transform -skew-y-[-12deg] uppercase tracking-widest">
          <h4 className="underline underline-offset-2 text-sm font-medium">Zodiac</h4>
          <p className="no-underline tracking-[0.5em] text-sm">Gemini</p>
        </div>
        <div className="transform -skew-y-[-12deg] uppercase tracking-widest">
          <h4 className="underline underline-offset-2 text-sm font-medium">Planet</h4>
          <p className="no-underline tracking-[0.5em] text-sm">pluto | jupiter</p>
        </div>
      </div>
    </main>
  );
}
