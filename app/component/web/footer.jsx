"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 ">

      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-10">

        {/* BRAND */}
        <div>
          <h2 className="text-white text-2xl font-bold mb-4">
            DoSomething
          </h2>
          <p className="text-sm leading-relaxed">
            A trusted service marketplace connecting users with skilled providers.
            Post jobs for free and pay only after work completion.
          </p>
        </div>

        {/* SERVICES */}
        <div>
          <h3 className="text-white font-semibold mb-4">Services</h3>
          <ul className="space-y-2 text-sm">
            <li>Cooking</li>
            <li>Cleaning</li>
            <li>Electrical</li>
            <li>Plumbing</li>
            <li>Housekeeping</li>
          </ul>
        </div>

        {/* COMPANY */}
        <div>
          <h3 className="text-white font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/services">Services</Link></li>
          </ul>
        </div>

        {/* LEGAL + CONTACT */}
        <div>
          <h3 className="text-white font-semibold mb-4">Legal</h3>
          <ul className="space-y-2 text-sm mb-4">
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms & Conditions</Link></li>
            <li><Link href="/refund">Refund Policy</Link></li>
          </ul>

          <div className="text-sm">
            <p>Email: satymkumart111@gmail.com</p>
            <p>Phone: +91-8319445102</p>
            <p>Address: Indore (M.P.) India</p>
         </div>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-gray-800 text-center py-5 text-sm">
        © {new Date().getFullYear()} DoSomething.world. All rights reserved.
      </div>

    </footer>
  );
}