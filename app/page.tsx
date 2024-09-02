import Image from "next/image";
import { ModeToggle } from "../components/ui/Toggle";

export default function Home() {
  return (
    <main className="flex min-h-screen max-w-md flex-col m-auto items-center gap-8">
      <ModeToggle/>
      <div className="z-10 w-full items-center justify-between text-sm lg:flex">
        <h1 className="tracking-[0.6em] text-3xl font-bold uppercase text-center">Phase Name</h1>
        <h2 className="tracking-[0.6em] text-xl font-bold uppercase text-center mt-8">Days In Phase</h2>
      </div>
      <Image src="/default.png" alt="default img" width={300} height={200} className="m-auto"/>
      <article className="w-full flex justify-between px-8 text-lg uppercase tracking-[0.8em] font-semibold text-neutral-500">
        <div>
          <h3>Previous</h3>
          <p className="text-neutral-800 text-sm">Phase</p>
        </div>
        <div>
          <h3>Next</h3>
          <p className="text-neutral-800 text-sm">Phase</p>
        </div>
      </article>
      
      <article className="flex justify-around w-full font-bold text-neutral-300">
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

      <div className="w-full h-60 bg-neutral-200 skew-y-[-12deg]"></div>
    </main>
  );
}
