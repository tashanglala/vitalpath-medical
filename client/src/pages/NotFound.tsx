// Design direction: Quiet Confidence — utility states should feel like patient guidance, not generic app errors; use Path Blue, soft green, and directional care-path cues.
import { ArrowLeft, ArrowRight, Compass, Home, MapPin } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f8fbfa] text-[#17313b]">
      <header className="border-b border-[#e4eeeb] bg-[#fdfefd]/95">
        <div className="container flex h-[76px] items-center justify-between">
          <Link href="/" className="group flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#e5f1ee] p-1.5 transition-transform duration-200 group-hover:-rotate-3">
              <img src="/manus-storage/vitalpath-mark_36c74441.png" alt="" className="h-full w-full object-contain" />
            </span>
            <span className="leading-none"><span className="block text-[15px] font-extrabold tracking-[0.16em] text-[#155e75]">VITALPATH</span><span className="mt-1 block text-[9px] font-bold tracking-[0.32em] text-[#6a7f80]">MEDICAL</span></span>
          </Link>
          <span className="hidden text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#78918f] sm:block">Patient wayfinding</span>
        </div>
      </header>
      <main className="container grid min-h-[calc(100vh-77px)] items-center gap-16 py-20 lg:grid-cols-[1fr_0.75fr]">
        <div className="max-w-xl">
          <p className="eyebrow">A small detour / 404</p>
          <h1 className="section-title mt-5">Let’s find the<br /><em>right next step.</em></h1>
          <p className="section-copy max-w-md">This page is not on our current care path. The destination may have moved, but getting back to helpful information is easy.</p>
          <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <Link href="/" className="inline-flex items-center gap-3 rounded-full bg-[#155e75] px-6 py-3.5 text-sm font-bold text-white shadow-[0_14px_24px_rgba(21,94,117,0.18)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#0e4b5e] active:scale-[0.97]">Return to home <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/#services" className="inline-flex items-center gap-2 rounded-full px-5 py-3.5 text-sm font-bold text-[#155e75] transition hover:bg-white"><ArrowLeft className="h-4 w-4" /> Explore services</Link>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-[390px]">
          <div className="absolute -left-5 top-20 h-px w-[calc(100%+2.5rem)] bg-[#a8cabe]" />
          <div className="absolute -left-5 top-20 h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 border-[#f8fbfa] bg-[#4c916f] shadow-[0_0_0_1px_#78ab91]" />
          <div className="relative rounded-[28px] border border-[#d5e6df] bg-white p-8 shadow-[0_22px_55px_rgba(35,85,75,0.08)]">
            <div className="flex items-center justify-between"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e5f1ee] text-[#155e75]"><Compass className="h-6 w-6" /></span><span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#88a49e]">Care path</span></div>
            <div className="mt-12 space-y-3">
              <div className="flex items-center gap-3 rounded-2xl border border-[#dceae6] bg-[#f7fbf9] p-4"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#155e75] text-[11px] font-extrabold text-white">01</span><span className="text-sm font-bold text-[#31545e]">Start with home</span><Home className="ml-auto h-4 w-4 text-[#83a7a0]" /></div>
              <div className="ml-4 h-7 border-l border-dashed border-[#8bb8a7]" />
              <div className="flex items-center gap-3 rounded-2xl border border-[#c9e0d4] bg-[#eef7f1] p-4"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#b9ddc4] text-[11px] font-extrabold text-[#356b53]">02</span><span className="text-sm font-bold text-[#31545e]">Choose your next step</span><MapPin className="ml-auto h-4 w-4 text-[#4c916f]" /></div>
            </div>
            <p className="mt-8 border-t border-[#e4eeeb] pt-5 text-sm leading-6 text-[#71878a]">If you were looking for a specific page, our care team can help point you in the right direction.</p>
            <Link href="/#inquire" className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#155e75]">Talk to the care team <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </main>
    </div>
  );
}
