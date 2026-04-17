import Link from "next/link"


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
      <footer className="bg-black text-gray-400 text-center py-5">
        © {new Date().getFullYear()} Work Platform. All rights reserved.
      </footer>

    </main>

  );
}




// "use client";
// import { useState } from "react";

// export default function Page() {
//   const [pickup, setPickup] = useState("");
//   const [drop, setDrop] = useState("");
//   const [date, setDate] = useState("");
//   const [time, setTime] = useState("");

//   const handleSubmit = () => {
//     alert(`Cab booked from ${pickup} to ${drop} on ${date} at ${time}`);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
//       <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6">
//         <h1 className="text-2xl font-bold mb-6 text-center">Book Your Cab</h1>

//         <div className="space-y-4">
//           <input
//             placeholder="Pickup Location"
//             value={pickup}
//             onChange={(e) => setPickup(e.target.value)}
//             className="w-full p-3 border rounded-xl"
//           />
//           <input
//             placeholder="Drop Location"
//             value={drop}
//             onChange={(e) => setDrop(e.target.value)}
//             className="w-full p-3 border rounded-xl"
//           />
//           <input
//             type="date"
//             value={date}
//             onChange={(e) => setDate(e.target.value)}
//             className="w-full p-3 border rounded-xl"
//           />
//           <input
//             type="time"
//             value={time}
//             onChange={(e) => setTime(e.target.value)}
//             className="w-full p-3 border rounded-xl"
//           />
//           <button
//             onClick={handleSubmit}
//             className="w-full bg-blue-600 text-white p-3 rounded-xl text-lg hover:bg-blue-700 transition"
//           >
//             Book Now
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }