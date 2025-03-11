import { useState } from "react";
import Link from "next/link"; // ✅ Use Next.js built-in routing
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl text-blue-900 font-bold">🦷 AI Dental Diagnosis</h1>

        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`md:flex ${isOpen ? "block" : "hidden"} space-x-4`}>
          <Link href="/" className="text-green-800">Home</Link>
          <Link href="/about" className="text-green-800">About</Link>
          <Link href="/contact" className="text-green-800">Contact</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
