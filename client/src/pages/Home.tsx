// Design direction: Quiet Confidence — clinical editorial hierarchy, calm white space, Path Blue trust, soft green care signals, and patient-first wayfinding.
import { MapView } from "@/components/Map";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  FileText,
  HeartPulse,
  Leaf,
  LocateFixed,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Navigation,
  Phone,
  Search,
  ShieldCheck,
  Stethoscope,
  UsersRound,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";

type ServiceCategory =
  | "All services"
  | "Primary care"
  | "Specialty care"
  | "Women’s health"
  | "Behavioral health"
  | "Urgent care"
  | "Prevention";

type Location = {
  name: string;
  address: string;
  phone: string;
  hours: string;
  distance: string;
  position: { lat: number; lng: number };
};

const services: Array<{
  category: Exclude<ServiceCategory, "All services">;
  icon: typeof HeartPulse;
  title: string;
  description: string;
  meta: string;
  tone: "blue" | "green" | "sand";
}> = [
  {
    category: "Primary care",
    icon: HeartPulse,
    title: "Primary care",
    description: "Everyday care that keeps the whole picture in view, from annual checkups to ongoing support.",
    meta: "Adults · Families · Seniors",
    tone: "blue",
  },
  {
    category: "Specialty care",
    icon: Stethoscope,
    title: "Specialty care",
    description: "Focused expertise for complex needs, coordinated with the people who know your story.",
    meta: "Cardiology · Orthopedics · Neurology",
    tone: "green",
  },
  {
    category: "Women’s health",
    icon: UsersRound,
    title: "Women’s health",
    description: "Thoughtful, whole-person care across every stage of life and every kind of question.",
    meta: "Wellness · Reproductive health",
    tone: "sand",
  },
  {
    category: "Behavioral health",
    icon: MessageCircle,
    title: "Behavioral health",
    description: "Private, practical support for mental wellbeing, stress, relationships, and change.",
    meta: "Therapy · Psychiatry · Support",
    tone: "green",
  },
  {
    category: "Urgent care",
    icon: Activity,
    title: "Urgent care",
    description: "Same-day help for the moments that cannot wait, without losing continuity afterward.",
    meta: "Walk-ins · Same-day visits",
    tone: "blue",
  },
  {
    category: "Prevention",
    icon: ShieldCheck,
    title: "Prevention & wellness",
    description: "Small steps and screenings that help you stay ahead of what comes next.",
    meta: "Screenings · Vaccines · Coaching",
    tone: "sand",
  },
];

const providers = [
  {
    name: "Dr. Maya Chen",
    role: "Family Medicine",
    credentials: "MD, MPH · Board Certified",
    focus: "Preventive care, chronic conditions, family health",
    initials: "MC",
    tone: "bg-[#dceef0] text-[#155e75]",
  },
  {
    name: "Dr. Elias Morgan",
    role: "Cardiology",
    credentials: "MD, FACC · Board Certified",
    focus: "Heart health, hypertension, preventive cardiology",
    initials: "EM",
    tone: "bg-[#e4f0e5] text-[#356b53]",
  },
  {
    name: "Dr. Amara Okafor",
    role: "Behavioral Health",
    credentials: "PhD, LCSW · Licensed Clinician",
    focus: "Anxiety, life transitions, family support",
    initials: "AO",
    tone: "bg-[#f4eadc] text-[#8c5d2f]",
  },
];

const locations: Location[] = [
  {
    name: "North Harbor Clinic",
    address: "18 Harbor Way, Suite 100",
    phone: "(206) 555-0148",
    hours: "Mon–Fri · 7:30am–6pm",
    distance: "0.8 mi",
    position: { lat: 47.6097, lng: -122.3331 },
  },
  {
    name: "Meadowbrook Center",
    address: "2400 Meadowbrook Ave",
    phone: "(206) 555-0162",
    hours: "Mon–Sat · 8am–7pm",
    distance: "2.4 mi",
    position: { lat: 47.6205, lng: -122.3493 },
  },
  {
    name: "Southline Medical Pavilion",
    address: "901 Southline Blvd, Floor 2",
    phone: "(206) 555-0127",
    hours: "Mon–Fri · 8am–5pm",
    distance: "4.9 mi",
    position: { lat: 47.5801, lng: -122.3358 },
  },
];

const resources = [
  {
    icon: FileText,
    type: "Guide",
    title: "Preparing for your first visit",
    copy: "What to bring, what to expect, and how to make the most of your time with us.",
  },
  {
    icon: CalendarDays,
    type: "Checklist",
    title: "A better annual checkup",
    copy: "A simple set of questions to help you turn a routine visit into a useful conversation.",
  },
  {
    icon: Leaf,
    type: "Wellbeing",
    title: "Small steps for lasting energy",
    copy: "Practical ideas for sleep, movement, and nourishment that can meet real life where it is.",
  },
];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function PathMarker({ step }: { step: string }) {
  return (
    <div className="section-path" aria-hidden="true">
      <span className="section-path-dot">{step}</span>
      <span className="section-path-line" />
      <span className="section-path-arrow"><ChevronRight className="h-3 w-3" /></span>
    </div>
  );
}

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [serviceFilter, setServiceFilter] = useState<ServiceCategory>("All services");
  const [expandedProvider, setExpandedProvider] = useState<string | null>(null);
  const [locationQuery, setLocationQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);
  const [inquirySent, setInquirySent] = useState(false);
  const [portalNotice, setPortalNotice] = useState(false);
  const [inquiryService, setInquiryService] = useState("");
  const mapRef = useRef<google.maps.Map | null>(null);

  const filteredServices = useMemo(
    () =>
      serviceFilter === "All services"
        ? services
        : services.filter((service) => service.category === serviceFilter),
    [serviceFilter],
  );

  const filteredLocations = useMemo(() => {
    const query = locationQuery.trim().toLowerCase();
    if (!query) return locations;
    return locations.filter((location) =>
      `${location.name} ${location.address}`.toLowerCase().includes(query),
    );
  }, [locationQuery]);

  useEffect(() => {
    if (filteredLocations.length && !filteredLocations.some((location) => location.name === selectedLocation.name)) {
      setSelectedLocation(filteredLocations[0]);
    }
  }, [filteredLocations, selectedLocation.name]);

  const selectLocation = (location: Location) => {
    setSelectedLocation(location);
    mapRef.current?.panTo(location.position);
    mapRef.current?.setZoom(14);
  };

  const submitInquiry = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setInquirySent(true);
  };

  return (
    <div className="min-h-screen bg-[#f8fbfa] text-[#17313b] selection:bg-[#cde5de] selection:text-[#155e75]">
      <div className="border-b border-[#dbe8e5] bg-[#eef7f3] px-4 py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.13em] text-[#356b53] sm:text-xs">
        <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[#68a482] align-middle" />
        New patients are welcome · Most visits available within 7 days
      </div>

      <header className="sticky top-0 z-40 border-b border-[#e4eeeb] bg-[#fdfefd]/95 backdrop-blur-xl">
        <div className="container flex h-[76px] items-center justify-between gap-8">
          <button className="group flex items-center gap-3 text-left" onClick={() => scrollToSection("top")} aria-label="VitalPath Medical home">
            <span className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#e5f1ee] p-1.5 transition-transform duration-200 group-hover:-rotate-3">
              <img src="/manus-storage/vitalpath-mark_36c74441.png" alt="" className="h-full w-full object-contain" />
            </span>
            <span className="leading-none">
              <span className="block text-[15px] font-extrabold tracking-[0.16em] text-[#155e75]">VITALPATH</span>
              <span className="mt-1 block text-[9px] font-bold tracking-[0.32em] text-[#6a7f80]">MEDICAL</span>
            </span>
          </button>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
            {[
              ["Services", "services"],
              ["Our providers", "providers"],
              ["Patient resources", "resources"],
              ["Locations", "locations"],
            ].map(([label, id]) => (
              <button key={id} onClick={() => scrollToSection(id)} className="text-sm font-semibold text-[#49666b] transition-colors duration-150 hover:text-[#155e75]">
                {label}
              </button>
            ))}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <button onClick={() => setPortalNotice(true)} className="text-sm font-bold text-[#155e75] transition-colors hover:text-[#0d4353]">Patient portal</button>
            <button onClick={() => scrollToSection("inquire")} className="inline-flex items-center gap-2 rounded-full bg-[#155e75] px-5 py-3 text-sm font-bold text-white shadow-[0_8px_18px_rgba(21,94,117,0.15)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#0e4b5e] active:scale-[0.97]">
              Make an inquiry <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

          <button className="rounded-full p-2 text-[#155e75] lg:hidden" onClick={() => setMobileOpen((open) => !open)} aria-label={mobileOpen ? "Close menu" : "Open menu"}>
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        {mobileOpen && (
          <div className="border-t border-[#e4eeeb] bg-white px-5 py-4 lg:hidden">
            <nav className="container flex flex-col gap-1" aria-label="Mobile navigation">
              {["Services", "Our providers", "Patient resources", "Locations"].map((label) => {
                const id = label === "Our providers" ? "providers" : label.toLowerCase().replace("patient ", "");
                return <button key={label} className="border-b border-[#edf3f1] py-3 text-left text-sm font-bold text-[#31545e]" onClick={() => { setMobileOpen(false); scrollToSection(id); }}>{label}</button>;
              })}
              <button className="mt-3 rounded-full bg-[#155e75] px-4 py-3 text-left text-sm font-bold text-white" onClick={() => { setMobileOpen(false); scrollToSection("inquire"); }}>Make an inquiry <ArrowUpRight className="ml-1 inline h-4 w-4" /></button>
            </nav>
          </div>
        )}
      </header>

      {portalNotice && (
        <div className="fixed right-4 top-[150px] z-50 flex max-w-sm items-start gap-3 rounded-2xl border border-[#b9ddd0] bg-white px-4 py-3 text-sm text-[#31545e] shadow-[0_18px_50px_rgba(23,49,59,0.16)]">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#4c916f]" />
          <p><span className="font-bold">Patient portal access</span><br />Portal sign-in will open in a secure window when connected.</p>
          <button onClick={() => setPortalNotice(false)} className="rounded-full p-1 text-[#7b9595] hover:bg-[#eef7f3]" aria-label="Dismiss notice"><X className="h-4 w-4" /></button>
        </div>
      )}

      <main id="top">
        <section className="relative isolate overflow-hidden border-b border-[#dfece9] bg-[#e8f1ef]">
          <div className="absolute inset-0">
            <img src="/manus-storage/vitalpath-hero_2f2f141a.jpg" alt="Physician and patient speaking together in a bright clinic" className="h-full w-full object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#f8fbfa] via-[#f8fbfa]/95 via-43% to-[#f8fbfa]/10" />
            <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-[#155e75]/10 to-transparent" />
          </div>
          <div className="container relative flex min-h-[630px] items-center py-20 sm:min-h-[680px] lg:py-24">
            <div className="max-w-[580px] animate-[fadeUp_600ms_ease-out_both]">
              <p className="mb-6 flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#4c916f]"><span className="h-px w-9 bg-[#79aa8b]" /> Care, clearly connected</p>
              <h1 className="max-w-[550px] font-serif text-[clamp(3.3rem,6.5vw,6.25rem)] leading-[0.94] tracking-[-0.045em] text-[#17313b]">A clearer path to feeling <em className="text-[#155e75]">well.</em></h1>
              <p className="mt-8 max-w-[480px] text-[17px] leading-8 text-[#506b70] sm:text-lg">Expert care should feel easier to find, easier to understand, and easier to trust. VitalPath brings your next step into focus.</p>
              <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <button onClick={() => scrollToSection("services")} className="inline-flex items-center gap-3 rounded-full bg-[#155e75] px-6 py-3.5 text-sm font-bold text-white shadow-[0_14px_24px_rgba(21,94,117,0.2)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#0e4b5e] active:scale-[0.97]">Explore services <ArrowRight className="h-4 w-4" /></button>
                <button onClick={() => scrollToSection("locations")} className="inline-flex items-center gap-2 rounded-full px-5 py-3.5 text-sm font-bold text-[#155e75] transition hover:bg-white/70"><LocateFixed className="h-4 w-4" /> Find a location</button>
              </div>
              <div className="mt-14 flex flex-wrap gap-x-8 gap-y-3 border-t border-[#c7dcd7] pt-5 text-xs font-bold text-[#547276]">
                <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-[#4c916f]" /> Coordinated care</span>
                <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-[#4c916f]" /> Same-week access</span>
              </div>
            </div>
          </div>
          <div className="absolute bottom-7 right-6 hidden items-center gap-3 text-right text-[10px] font-bold uppercase tracking-[0.17em] text-[#567175] xl:flex"><span className="h-px w-10 bg-[#8eb3aa]" /> Serving the greater Seattle area</div>
        </section>

        <section className="border-b border-[#e1ece9] bg-white">
          <div className="container grid gap-8 py-8 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-[#dceae6]">
            {[
              ["01", "Listen first", "Care begins with understanding your goals."],
              ["02", "Make a plan", "Your team turns information into next steps."],
              ["03", "Stay connected", "Support continues between appointments."],
            ].map(([number, title, copy]) => (
              <div key={number} className="flex items-start gap-4 px-0 sm:px-8 first:pl-0 last:pr-0">
                <span className="font-serif text-2xl italic text-[#9bbdb2]">{number}</span>
                <div><p className="text-sm font-extrabold text-[#17313b]">{title}</p><p className="mt-1 text-sm leading-6 text-[#71878a]">{copy}</p></div>
              </div>
            ))}
          </div>
        </section>

        <section id="services" className="scroll-mt-24 bg-[#f8fbfa] py-24 sm:py-28">
          <div className="container">
            <PathMarker step="01" />
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div className="max-w-xl"><p className="eyebrow">Services / 01</p><h2 className="section-title">Care that moves<br /><em>with your life.</em></h2><p className="section-copy">From everyday questions to complex care, our teams work across specialties so you do not have to navigate alone.</p></div>
              <div className="flex max-w-full gap-2 overflow-x-auto pb-1 lg:max-w-[590px] lg:flex-wrap lg:justify-end">
                {(["All services", "Primary care", "Specialty care", "Women’s health", "Behavioral health", "Urgent care", "Prevention"] as ServiceCategory[]).map((filter) => (
                  <button key={filter} onClick={() => setServiceFilter(filter)} className={`whitespace-nowrap rounded-full border px-3.5 py-2 text-xs font-bold transition duration-180 ${serviceFilter === filter ? "border-[#155e75] bg-[#155e75] text-white" : "border-[#d4e4df] bg-white text-[#5b7477] hover:border-[#9dbeb4] hover:text-[#155e75]"}`}>{filter}</button>
                ))}
              </div>
            </div>

            <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredServices.map((service, index) => {
                const Icon = service.icon;
                return <article key={service.title} className={`group relative overflow-hidden rounded-[22px] border border-[#dceae6] p-6 shadow-[0_10px_30px_rgba(29,71,77,0.04)] transition duration-200 hover:-translate-y-1 hover:border-[#a8c8be] hover:shadow-[0_18px_40px_rgba(29,71,77,0.09)] ${service.tone === "blue" ? "bg-[#f2f8f9]" : service.tone === "green" ? "bg-[#f2f8f3]" : "bg-[#fbf7ef]"}`} style={{ animationDelay: `${index * 45}ms` }}>
                  <div className="flex items-start justify-between"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#155e75] shadow-sm"><Icon className="h-5 w-5" /></span><span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#88a19f]">{service.category}</span></div>
                  <h3 className="mt-12 font-serif text-[29px] tracking-[-0.03em] text-[#17313b]">{service.title}</h3>
                  <p className="mt-3 min-h-[72px] text-sm leading-6 text-[#60797b]">{service.description}</p>
                  <div className="mt-6 flex items-center justify-between gap-3 border-t border-[#d6e5e0] pt-4"><span className="text-[11px] font-bold text-[#72908d]">{service.meta}</span><button onClick={() => { setInquiryService(service.title); scrollToSection("inquire"); }} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#155e75] transition group-hover:bg-[#155e75] group-hover:text-white" aria-label={`Ask about ${service.title}`}><ArrowUpRight className="h-4 w-4" /></button></div>
                </article>;
              })}
            </div>
            <div className="mt-9 flex items-center justify-between border-t border-[#dceae6] pt-5"><p className="text-sm text-[#71878a]">Not sure where to begin? We can help you find the right door.</p><button onClick={() => scrollToSection("inquire")} className="hidden items-center gap-2 text-sm font-bold text-[#155e75] sm:flex">Talk to our team <ArrowRight className="h-4 w-4" /></button></div>
          </div>
        </section>

        <section id="providers" className="scroll-mt-24 overflow-hidden bg-[#155e75] py-24 text-white sm:py-28">
          <div className="container relative">
            <PathMarker step="02" />
            <div className="pointer-events-none absolute -right-12 -top-24 h-80 w-80 rounded-full border border-white/10" /><div className="pointer-events-none absolute -right-1 -top-12 h-56 w-56 rounded-full border border-white/10" />
            <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-end"><div className="max-w-xl"><p className="eyebrow text-[#a9d2bc]">Our providers / 02</p><h2 className="section-title dark-section-title text-white">Good care starts<br />with <em>being heard.</em></h2></div><p className="max-w-[350px] text-sm leading-7 text-[#c5dcda]">A team with different perspectives, one shared commitment: make your care feel personal, clear, and connected.</p></div>
            <div className="mt-14 grid gap-4 lg:grid-cols-3">
              {providers.map((provider) => <article key={provider.name} className="rounded-[22px] border border-white/15 bg-white/10 p-5 backdrop-blur-sm transition duration-200 hover:-translate-y-1 hover:bg-white/15"><div className="flex items-center gap-4"><div className={`flex h-16 w-16 items-center justify-center rounded-full text-sm font-extrabold ${provider.tone}`}>{provider.initials}</div><div><h3 className="font-serif text-[25px] tracking-[-0.03em] text-white">{provider.name}</h3><p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-[#a9d2bc]">{provider.role}</p></div></div><p className="mt-6 border-t border-white/15 pt-4 text-xs font-semibold text-[#d1e2df]">{provider.credentials}</p><div className={`grid transition-[grid-template-rows] duration-200 ${expandedProvider === provider.name ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}><div className="overflow-hidden"><p className="pt-3 text-sm leading-6 text-[#c5dcda]">Focus areas: {provider.focus}.</p></div></div><button onClick={() => setExpandedProvider(expandedProvider === provider.name ? null : provider.name)} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#b9ddc4]">{expandedProvider === provider.name ? "Hide focus areas" : "View focus areas"}<ChevronDown className={`h-4 w-4 transition-transform ${expandedProvider === provider.name ? "rotate-180" : ""}`} /></button></article>)}
            </div>
            <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/15 pt-5 sm:flex-row sm:items-center"><p className="text-sm text-[#c5dcda]">Looking for a specific specialty or provider?</p><button onClick={() => scrollToSection("inquire")} className="inline-flex items-center gap-2 rounded-full bg-[#b9ddc4] px-5 py-3 text-sm font-extrabold text-[#164d48] transition hover:bg-white active:scale-[0.97]">Help me find the right fit <ArrowRight className="h-4 w-4" /></button></div>
          </div>
        </section>

        <section id="resources" className="scroll-mt-24 bg-[#f4f8f6] py-24 sm:py-28">
          <div className="container">
            <PathMarker step="03" />
            <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div><p className="eyebrow">Patient resources / 03</p><h2 className="section-title">A little more<br /><em>certainty.</em></h2><p className="section-copy">Helpful information can make healthcare feel less intimidating. Start with the resources patients ask for most.</p><button onClick={() => setPortalNotice(true)} className="mt-8 inline-flex items-center gap-2 text-sm font-extrabold text-[#155e75]">Browse the patient portal <ArrowUpRight className="h-4 w-4" /></button></div>
            <div className="relative overflow-hidden rounded-[26px] border border-[#d9e8e3] bg-[#dfeee9] p-7 sm:p-9"><img src="/manus-storage/vitalpath-resources_4f78c1f8.jpg" alt="Hands organizing health notes at a kitchen table" className="absolute inset-0 h-full w-full object-cover opacity-35 mix-blend-multiply" /><div className="relative z-10 max-w-[450px]"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/90 text-[#155e75]"><FileText className="h-5 w-5" /></div><p className="mt-16 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#356b53]">Start here</p><h3 className="mt-3 font-serif text-4xl leading-[1.05] tracking-[-0.04em] text-[#17313b]">Know what to expect before you arrive.</h3><p className="mt-4 max-w-sm text-sm leading-6 text-[#4f6f70]">A first visit is a conversation, not a test. These short guides help you feel prepared and in control.</p></div><div className="relative z-10 mt-10 grid gap-2 sm:grid-cols-3">{resources.map((resource) => { const Icon = resource.icon; return <button key={resource.title} onClick={() => setPortalNotice(true)} className="rounded-2xl border border-white/70 bg-white/75 p-3 text-left backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white"><Icon className="h-4 w-4 text-[#4c916f]" /><span className="mt-3 block text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#155e75]">{resource.type}</span><span className="mt-1 block text-xs font-bold leading-4 text-[#31545e]">{resource.title}</span></button>; })}</div></div>
            </div>
          </div>
        </section>

        <section id="locations" className="scroll-mt-24 bg-white py-24 sm:py-28">
          <div className="container"><PathMarker step="04" /><div className="max-w-xl"><p className="eyebrow">Locations / 04</p><h2 className="section-title">Care, <em>close to home.</em></h2><p className="section-copy">Three neighborhood clinics, one connected team. Find the place that works best for your day.</p></div><div className="mt-12 grid overflow-hidden rounded-[26px] border border-[#dceae6] bg-[#f8fbfa] lg:grid-cols-[0.84fr_1.16fr]">
            <div className="order-2 border-t border-[#dceae6] bg-[#f8fbfa] p-5 lg:order-1 lg:border-r lg:border-t-0 lg:p-7"><div className="relative"><Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8aa29f]" /><input value={locationQuery} onChange={(event) => setLocationQuery(event.target.value)} placeholder="Search by neighborhood or address" className="h-12 w-full rounded-xl border border-[#d4e4df] bg-white pl-11 pr-4 text-sm text-[#31545e] outline-none transition placeholder:text-[#9aafac] focus:border-[#82afa0] focus:ring-4 focus:ring-[#dceee7]" /></div><div className="mt-5 space-y-2">{filteredLocations.map((location) => <button key={location.name} onClick={() => selectLocation(location)} className={`w-full rounded-2xl border p-4 text-left transition ${selectedLocation.name === location.name ? "border-[#8bb8a7] bg-white shadow-[0_8px_22px_rgba(34,84,76,0.07)]" : "border-transparent hover:border-[#d4e4df] hover:bg-white/70"}`}><div className="flex items-start justify-between gap-3"><div><p className="font-serif text-[21px] tracking-[-0.02em] text-[#17313b]">{location.name}</p><p className="mt-1 text-xs leading-5 text-[#71878a]">{location.address}</p></div><span className="rounded-full bg-[#e7f2ed] px-2 py-1 text-[10px] font-bold text-[#4c916f]">{location.distance}</span></div><div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-semibold text-[#66817f]"><span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5 text-[#88a6a0]" /> {location.hours}</span><span className="inline-flex items-center gap-1"><Phone className="h-3.5 w-3.5 text-[#88a6a0]" /> {location.phone}</span></div></button>)}{!filteredLocations.length && <div className="rounded-2xl border border-dashed border-[#c9ddd6] p-5 text-sm text-[#71878a]">No clinic matches that search. Try a nearby street or neighborhood.</div>}</div></div>
            <div className="relative order-1 min-h-[430px] bg-[#dceae5] lg:order-2"><MapView className="h-full min-h-[430px] w-full" initialCenter={selectedLocation.position} initialZoom={12} onMapReady={(map) => { mapRef.current = map; locations.forEach((location) => { new google.maps.Marker({ map, position: location.position, title: location.name }); }); }} /><div className="pointer-events-none absolute left-5 top-5 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-lg backdrop-blur-sm"><p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#4c916f]">Explore our clinics</p><p className="mt-1 text-sm font-bold text-[#17313b]">{locations.length} locations serving the area</p></div><div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-4 rounded-2xl border border-white/70 bg-[#155e75]/95 px-4 py-3 text-white shadow-lg"><div className="flex min-w-0 items-center gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#b9ddc4] text-[#155e75]"><Navigation className="h-4 w-4" /></span><div className="min-w-0"><p className="truncate text-sm font-bold">{selectedLocation.name}</p><p className="truncate text-[11px] text-[#c5dcda]">{selectedLocation.address}</p></div></div><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${selectedLocation.name}, ${selectedLocation.address}`)}`} target="_blank" rel="noreferrer" className="shrink-0 rounded-full bg-white/10 px-3 py-2 text-xs font-bold text-white transition hover:bg-white/20">Directions <ArrowUpRight className="ml-1 inline h-3.5 w-3.5" /></a></div></div>
          </div></div>
        </section>

        <section id="inquire" className="scroll-mt-24 bg-[#edf6f2] py-24 sm:py-28">
          <div className="container"><PathMarker step="05" /><div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div><p className="eyebrow">Start a conversation / 05</p><h2 className="section-title">Your next step<br />can start <em>here.</em></h2><p className="section-copy">Tell us a little about what you are looking for. Our team will help you find the right place to begin.</p><div className="mt-10 space-y-4 border-t border-[#cfe1db] pt-6"><p className="flex items-start gap-3 text-sm leading-6 text-[#557274]"><Mail className="mt-1 h-4 w-4 shrink-0 text-[#4c916f]" /><span><strong className="text-[#31545e]">Prefer email?</strong><br />care@vitalpathmedical.com</span></p><p className="flex items-start gap-3 text-sm leading-6 text-[#557274]"><Phone className="mt-1 h-4 w-4 shrink-0 text-[#4c916f]" /><span><strong className="text-[#31545e]">Call our care team</strong><br />(206) 555-0100 · Mon–Fri, 8am–6pm</span></p></div></div>
            <div className="rounded-[24px] border border-[#d3e5de] bg-white p-6 shadow-[0_14px_40px_rgba(45,91,82,0.07)] sm:p-8">{inquirySent ? <div className="flex min-h-[390px] flex-col items-center justify-center text-center"><span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e5f2e9] text-[#4c916f]"><Check className="h-7 w-7" /></span><h3 className="mt-6 font-serif text-3xl tracking-[-0.03em] text-[#17313b]">Thank you for reaching out.</h3><p className="mt-3 max-w-sm text-sm leading-6 text-[#6d8586]">A member of our care team will follow up during business hours. For urgent concerns, please call 911.</p><button onClick={() => setInquirySent(false)} className="mt-7 text-sm font-bold text-[#155e75]">Send another inquiry</button></div> : <form onSubmit={submitInquiry}><div className="flex items-center justify-between border-b border-[#e0ece8] pb-5"><div><p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#4c916f]">Patient inquiry</p><h3 className="mt-2 font-serif text-2xl tracking-[-0.03em] text-[#17313b]">How can we help?</h3></div><span className="text-xs font-semibold text-[#91a7a5]">No medical details needed</span></div><div className="mt-6 grid gap-5 sm:grid-cols-2"><label className="block"><span className="field-label">Your name</span><input required name="name" placeholder="Full name" className="field-input" /></label><label className="block"><span className="field-label">Email address</span><input required type="email" name="email" placeholder="you@example.com" className="field-input" /></label><label className="block sm:col-span-2"><span className="field-label">I am looking for</span><select value={inquiryService} onChange={(event) => setInquiryService(event.target.value)} className="field-input"><option value="">Choose an area of care</option>{services.map((service) => <option key={service.title} value={service.title}>{service.title}</option>)}</select></label><label className="block sm:col-span-2"><span className="field-label">How can we help?</span><textarea required name="message" rows={4} placeholder="A short note is perfect — please do not include sensitive medical information." className="field-input resize-none" /></label></div><div className="mt-6 flex flex-col items-start justify-between gap-4 border-t border-[#e0ece8] pt-5 sm:flex-row sm:items-center"><p className="max-w-[250px] text-[11px] leading-5 text-[#8ba09e]">By submitting, you agree that we may contact you about your inquiry. This form is not monitored for emergencies.</p><button type="submit" className="inline-flex items-center gap-2 rounded-full bg-[#155e75] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0e4b5e] active:scale-[0.97]">Send inquiry <ArrowRight className="h-4 w-4" /></button></div></form>}</div>
          </div>
        </div>
        </section>
      </main>

      <footer className="bg-[#17313b] text-white">
        <div className="container py-14 sm:py-16"><div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr] lg:gap-10"><div><button onClick={() => scrollToSection("top")} className="flex items-center gap-3 text-left"><span className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-white p-1.5"><img src="/manus-storage/vitalpath-mark_36c74441.png" alt="" className="h-full w-full object-contain" /></span><span className="leading-none"><span className="block text-[15px] font-extrabold tracking-[0.16em] text-white">VITALPATH</span><span className="mt-1 block text-[9px] font-bold tracking-[0.32em] text-[#9fc0bb]">MEDICAL</span></span></button><p className="mt-6 max-w-[260px] text-sm leading-6 text-[#a9c0be]">Care that meets you where you are — and stays connected to where you are going.</p></div><div><p className="footer-label">Explore</p><div className="mt-4 space-y-3 text-sm text-[#c0d2cf]"><button onClick={() => scrollToSection("services")} className="footer-link">Services</button><button onClick={() => scrollToSection("providers")} className="footer-link">Our providers</button><button onClick={() => scrollToSection("resources")} className="footer-link">Patient resources</button><button onClick={() => scrollToSection("locations")} className="footer-link">Locations</button></div></div><div><p className="footer-label">Patient access</p><div className="mt-4 space-y-3 text-sm text-[#c0d2cf]"><button onClick={() => setPortalNotice(true)} className="footer-link">Patient portal <ArrowUpRight className="ml-1 inline h-3.5 w-3.5" /></button><button onClick={() => scrollToSection("inquire")} className="footer-link">Make an inquiry</button><a className="footer-link block" href="tel:12065550100">Call (206) 555-0100</a></div></div><div className="rounded-2xl border border-[#52706f] bg-[#203f47] p-5"><p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#b9ddc4]"><Activity className="h-4 w-4" /> For emergencies</p><p className="mt-3 text-sm leading-6 text-[#e0ece8]">If you are experiencing a medical emergency, call <strong>911</strong> or go to the nearest emergency department.</p><p className="mt-3 text-xs leading-5 text-[#a9c0be]">This website is not monitored for urgent medical needs.</p></div></div><div className="mt-14 flex flex-col justify-between gap-4 border-t border-[#36545b] pt-5 text-[11px] text-[#8fa9a6] sm:flex-row"><p>© 2026 VitalPath Medical. A connected path to care.</p><div className="flex gap-5"><a href="#top" className="hover:text-white">Privacy</a><a href="#top" className="hover:text-white">Accessibility</a><a href="#top" className="hover:text-white">Notice of privacy practices</a></div></div></div>
      </footer>
    </div>
  );
}
