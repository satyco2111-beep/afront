import Link from "next/link"
import ServiceCard from "@/app/component/web/servicecard"
import Footer from "@/app/component/web/footer"

export default function WebHome() {
  return (
    // <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans bg-white ">
    //   <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white  sm:items-start  ">
    //  wellcome in WebHome    
    //  {/* <p>  NEXT_PUBLIC_BACKEN_BASE_URL :   {process.env.NEXT_PUBLIC_BACKEN_BASE_URL}</p> */}
    //   </main>
    // </div>
    <main className="w-full">

      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-6xl mx-auto px-6 py-24 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Hire. Work. Earn.
          </h1>

          <p className="text-lg max-w-3xl mx-auto opacity-90">
            A trusted marketplace where users post work and providers accept
            tasks, complete them, and earn money securely.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={'/register'} > <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-semibold transition">
              Register as User
            </button></Link>
            <Link href={'/register-provider'} >  <button className="border-2 border-white hover:bg-white hover:text-blue-700 px-8 py-3 rounded-full font-semibold transition">
              Register as Provider
            </button> </Link>
            <Link href={'/admin'} > <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-semibold transition">
              Go to Dashboard
            </button></Link>
            <Link href={'/browse-providers'} >  <button className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-full font-semibold transition">
              Browse Providers
            </button> </Link>
          </div>
        </div>
      </section>

      

      {/* HOW IT WORKS */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-14">
            How It Works
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
              <h3 className="text-xl font-semibold mb-4">
                Post a Job
              </h3>
              <p className="text-gray-600">
                Register as a user and post any work you need done, anytime.
              </p>
            </div>

            <div className="p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
              <h3 className="text-xl font-semibold mb-4">
                Accept Work
              </h3>
              <p className="text-gray-600">
                Providers browse jobs and accept work that matches their skills.
              </p>
            </div>

            <div className="p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
              <h3 className="text-xl font-semibold mb-4">
                Complete & Earn
              </h3>
              <p className="text-gray-600">
                Finish the task, get approval, and earn money safely.
              </p>
            </div>
          </div>
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
          <ServiceCard title="Custom Jobs" desc="Post any job and get matched with providers." />
        </div>
      </section>


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

      {/* USER TYPES */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-14">
            Who Can Join?
          </h2>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="bg-white p-10 rounded-2xl shadow-md">
              <h3 className="text-2xl font-semibold mb-6">
                Users
              </h3>
              <ul className="space-y-3 text-gray-600 text-left">
                <li>✔ Post any type of work</li>
                <li>✔ Choose the best provider</li>
                <li>✔ Track work progress</li>
              </ul>
            </div>

            <div className="bg-white p-10 rounded-2xl shadow-md">
              <h3 className="text-2xl font-semibold mb-6">
                Providers
              </h3>
              <ul className="space-y-3 text-gray-600 text-left">
                <li>✔ Accept jobs instantly</li>
                <li>✔ Work on your own schedule</li>
                <li>✔ Earn money online</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-6 py-24 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Start Today
          </h2>
          <p className="text-lg opacity-80 max-w-2xl mx-auto mb-10">
            Join thousands of users and providers working together on one
            powerful platform.
          </p>
         <Link href={'/register'} > <button className="bg-green-500 hover:bg-green-600 px-10 py-4 rounded-full text-lg font-semibold transition">
            Create  Account
          </button> </Link>
        </div>
      </section>

      {/* FOOTER */}
      {/* <footer className="bg-black text-gray-400 text-center py-5">
        © {new Date().getFullYear()} Work Platform. All rights reserved.
      </footer> */}
      <Footer />

    </main>

  );
}
