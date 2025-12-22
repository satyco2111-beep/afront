

export default function WebHome() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans bg-white ">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white  sm:items-start  ">
     wellcome in WebHome    
     {/* <p>  NEXT_PUBLIC_BACKEN_BASE_URL :   {process.env.NEXT_PUBLIC_BACKEN_BASE_URL}</p> */}
      </main>
    </div>
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