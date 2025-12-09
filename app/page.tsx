import Home from "./Components/Home";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Services from "./Components/Services";
import Discover from "./Components/Discover";
import Testimonials from "./Components/Testimonials";

export default function page() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-white">
      <Header />

      <main className="flex-1 flex items-center justify-center py-16">
        <div className="container mx-auto">
          < Home />
          < Services />
          < Discover />
          < Testimonials />
        </div>
      </main>


          <Footer />
    </div>
  );
}
