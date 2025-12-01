import Discover from "./Components/Discover";
import Footer from "./Components/Footer";
import Header from "./Components/Header";
import Home from "./Components/Home";
import Services from "./Components/Services";
import Testimonials from "./Components/Testimonials";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-white">
      {/* Header */}
      <Header />

      {/* Contenu principal */}
      <main className="flex flex-1 flex-col items-center justify-center w-full px-4 sm:px-6 md:px-20 py-8 text-center space-y-12">
        <Home />
        <Services />
        <Discover />
        <Testimonials />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
