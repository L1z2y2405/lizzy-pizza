import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api, getApiError } from "../api/client";
import PizzaCard from "../components/PizzaCard";

const promoSlides = [
  {
    label: "Spicy Choice",
    title: "Pepperoni Heatwave",
    subtitle: "Crisped cup-and-char pepperoni over our slow-simmered tomato sauce.",
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=1200&q=85",
  },
  {
    label: "Stone Oven Classic",
    title: "Stone Baked Margherita",
    subtitle: "Fresh mozzarella, basil, and blistered crust straight from the oven.",
    image:
      "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=1200&q=85",
  },
  {
    label: "Garden Favorite",
    title: "Garden Fire Special",
    subtitle: "Roasted vegetables, bright herbs, and a golden hand-stretched base.",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1200&q=85",
  },
  {
    label: "Chef Special",
    title: "Truffle Mushroom Night",
    subtitle: "Earthy mushrooms, creamy cheese, and a finishing drizzle of truffle oil.",
    image:
      "https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=1200&q=85",
  },
];

const SEARCH_DEBOUNCE_MS = 400;

function PromoCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % promoSlides.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, []);

  function previousSlide() {
    setActiveSlide((current) => (current === 0 ? promoSlides.length - 1 : current - 1));
  }

  function nextSlide() {
    setActiveSlide((current) => (current + 1) % promoSlides.length);
  }

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-orange-500 via-red-700 to-slate-950 p-2 shadow-2xl shadow-red-950/40">
      <div className="relative min-h-[22rem] overflow-hidden rounded-[1.65rem] ring-1 ring-white/15 md:min-h-[28rem]">
        <div
          className="flex h-full transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${activeSlide * 100}%)` }}
        >
          {promoSlides.map((slide) => (
            <article key={slide.title} className="relative min-w-full">
              <img src={slide.image} alt={slide.title} className="h-[22rem] w-full object-cover md:h-[28rem]" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/55 via-transparent to-slate-950/25" />
              <div className="absolute inset-x-0 bottom-0 space-y-3 p-6 pr-12 md:p-8 md:pr-12">
                <span className="inline-flex rounded-full bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-orange-100 ring-1 ring-white/25 backdrop-blur-md">
                  {slide.label}
                </span>
                <h2 className="text-3xl font-black leading-tight text-white md:text-5xl">{slide.title}</h2>
                <p className="max-w-md text-sm leading-6 text-orange-50 md:text-base">{slide.subtitle}</p>
              </div>
            </article>
          ))}
        </div>

        <button
          type="button"
          onClick={previousSlide}
          className="absolute right-20 top-5 grid h-11 w-11 place-items-center rounded-full bg-slate-950/35 text-xl font-black text-white ring-1 ring-white/25 backdrop-blur-md transition duration-200 hover:-translate-x-0.5 hover:bg-white/20 hover:ring-orange-200"
          aria-label="Previous promotion"
        >
          {"<"}
        </button>
        <button
          type="button"
          onClick={nextSlide}
          className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-slate-950/35 text-xl font-black text-white ring-1 ring-white/25 backdrop-blur-md transition duration-200 hover:translate-x-0.5 hover:bg-white/20 hover:ring-orange-200"
          aria-label="Next promotion"
        >
          {">"}
        </button>

        <div className="absolute bottom-4 right-5 flex gap-2">
          {promoSlides.map((slide, index) => (
            <button
              key={slide.title}
              type="button"
              onClick={() => setActiveSlide(index)}
              className={`h-2 rounded-full transition-all ${
                activeSlide === index ? "w-8 bg-orange-300" : "w-2 bg-white/45 hover:bg-white/70"
              }`}
              aria-label={`Show ${slide.title}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function HomepageFooter() {
  return (
    <footer className="mt-14 border-t border-orange-200/70 pt-8">
      <div className="rounded-[2rem] bg-slate-950 px-6 py-7 text-white shadow-xl shadow-orange-950/10 md:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-tomato text-base font-black text-white shadow-glow">
              LP
            </span>
            <div>
              <p className="text-xl font-black">Lizzy Pizza</p>
              <p className="mt-1 text-sm font-medium text-orange-100">
                Hotline ordering: <a className="font-black text-white transition hover:text-orange-300" href="tel:19007890">1900 7890</a>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://facebook.com"
              aria-label="Lizzy Pizza on Facebook"
              className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/15 transition duration-200 hover:-translate-y-0.5 hover:bg-tomato hover:shadow-lg hover:shadow-red-950/30"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                <path d="M14 8.4V6.8c0-.8.2-1.2 1.3-1.2H17V2.8c-.8-.1-1.6-.2-2.4-.2-2.4 0-4.1 1.5-4.1 4.2v1.6H8v3.1h2.5v9.9H14v-9.9h2.7l.4-3.1H14Z" />
              </svg>
            </a>
            <a
              href="https://instagram.com"
              aria-label="Lizzy Pizza on Instagram"
              className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/15 transition duration-200 hover:-translate-y-0.5 hover:bg-tomato hover:shadow-lg hover:shadow-red-950/30"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <path d="M17.5 6.5h.01" strokeLinecap="round" />
              </svg>
            </a>
          </div>
        </div>

        <div className="mt-6 border-t border-white/10 pt-5 text-sm font-medium text-slate-300">
          &copy; 2026 Lizzy Pizza | Privacy Policy
        </div>
      </div>
    </footer>
  );
}

export default function MenuPage() {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const controller = new AbortController();
    const searchTerm = debouncedSearch.trim();

    setLoading(true);
    api
      .get("/pizzas", {
        params: searchTerm ? { search: searchTerm } : {},
        signal: controller.signal,
      })
      .then(({ data }) => setPizzas(data))
      .catch((error) => {
        if (error.name !== "CanceledError" && error.code !== "ERR_CANCELED") {
          toast.error(getApiError(error));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [debouncedSearch]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <section className="mb-10 grid gap-8 rounded-[2rem] bg-slate-950 p-8 text-white shadow-glow lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-orange-300">Wood fired daily</p>
          <h1 className="max-w-3xl text-5xl font-black leading-tight md:text-7xl">
            Hot pizza, fast checkout, zero fuss.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-300">
            Order from Lizzy Pizza's signature menu, pick your nearest store, and track your pies from oven to doorstep.
          </p>
        </div>
        <PromoCarousel />
      </section>

      <div className="mb-6 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-3xl font-black text-slate-950">Pizza Menu</h2>
          <p className="mt-2 max-w-full text-base font-medium leading-7 text-slate-600 md:text-lg lg:whitespace-nowrap">
            Handcrafted, oven-fired pizzas made with fresh ingredients and signature recipes.
          </p>
        </div>
      </div>

      <div className="mb-8 rounded-[2rem] bg-white p-3 shadow-xl shadow-orange-950/10 ring-1 ring-orange-100">
        <label htmlFor="pizza-search" className="sr-only">
          Search pizzas by name
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-tomato">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m16.5 16.5 4 4" strokeLinecap="round" />
            </svg>
          </span>
          <input
            id="pizza-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search pepperoni, veggie, margherita..."
            className="w-full rounded-[1.55rem] border border-orange-100 bg-orange-50/70 py-4 pl-14 pr-4 text-base font-bold text-slate-950 outline-none transition duration-200 placeholder:text-slate-400 focus:border-tomato focus:bg-white focus:ring-4 focus:ring-red-100"
          />
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl bg-white p-10 text-center font-semibold text-slate-600">
          {debouncedSearch.trim() ? "Finding matching pizzas..." : "Loading pizzas..."}
        </div>
      ) : pizzas.length === 0 ? (
        <div className="rounded-3xl bg-white p-10 text-center shadow-xl shadow-orange-950/10 ring-1 ring-orange-100">
          <h3 className="text-2xl font-black text-slate-950">No pizzas found</h3>
          <p className="mt-3 text-base font-medium text-slate-600">
            Try another pizza name or clear the search to explore the full Lizzy Pizza menu.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {pizzas.map((pizza) => (
            <PizzaCard key={pizza.id} pizza={pizza} />
          ))}
        </div>
      )}
      <HomepageFooter />
    </main>
  );
}
