// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
import ServiceCard from "@/app/component/web/servicecard"
import Footer from "@/app/component/web/footer"


export default function Services() {
  return (
    <>
      {/* <Navbar /> */}
       <section className="bg-gradient-to-r from-indigo-600 to-blue-700 text-white text-center py-24 px-6">
        <h1 className="text-5xl font-bold mb-6">
          Hire Trusted Service Providers Easily
        </h1>

        <p className="max-w-2xl mx-auto opacity-90">
          Post jobs for free. Connect with skilled providers. Pay securely
          after work completion. We charge only 9% commission from providers.
        </p>
        <p className="max-w-2xl mx-auto opacity-90">
        Customers can set their own price when posting a job, starting from ₹94.
        </p>

        <div className="mt-10 flex justify-center gap-4 flex-wrap">
          <a href="/register">
            <button className="bg-green-500 px-6 py-3 rounded-full font-semibold">
              Post a Job (Free)
            </button>
          </a>

          <a href="/register-provider">
            <button className="border px-6 py-3 rounded-full">
              Become Provider
            </button>
          </a>
        </div>
      </section>

        {/* SERVICES */}
            <section className="py-20 bg-gray-50 px-6">
              <h2 className="text-4xl font-bold text-center mb-12">
                Our Services
              </h2>
      
              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <ServiceCard title="Cooking" desc="Home cooking, party catering, restaurant support." />
                <ServiceCard title="Cleaning" desc="Home, bathroom, clothes, kitchen cleaning services." />
                <ServiceCard title="Electrical Repair" desc="Appliance repair, wiring, maintenance." />
                <ServiceCard title="Plumbing" desc="Pipe repair, fittings, water system services." />
                <ServiceCard title="Housekeeping" desc="Full home maintenance and support." />
                <ServiceCard title="Beauty & Salon" desc="Professional beauty, grooming, makeup, and salon services at your doorstep." />
                {/* <ServiceCard title="Custom Jobs" desc="Post any job and get matched with providers." /> */}
              </div>
            </section>
      

      <main className="max-w-5xl mx-auto px-6 py-20">
        {/* <h1 className="text-4xl font-bold mb-10">Our Services</h1> */}

        <ul className="space-y-6 text-gray-700">
          <li><b>Cooking:</b> Home chefs, event catering, restaurant help.</li>
          <li><b>Cleaning:</b> Home, bathroom, kitchen, clothes cleaning.</li>
          <li><b>Electrical:</b> Appliance repair and maintenance.</li>
          <li><b>Plumbing:</b> Pipe fixing, water systems.</li>
          <li><b>Housekeeping:</b> Full-time or part-time support.</li>
          <li><b>Beauty & Salon:</b>
            Professional beauty, grooming, makeup, and salon services at your doorstep.
            </li>
        </ul>
      </main>

     
         {/* FOOTER */}
      {/* <footer className="bg-black text-gray-400 text-center py-5">
        © {new Date().getFullYear()} Work Platform. All rights reserved.
      </footer> */}
      <Footer />
    </>
  );
}