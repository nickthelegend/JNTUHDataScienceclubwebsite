"use client";

import Link from "next/link";
import { FaInstagram, FaWhatsapp, FaLinkedin } from "react-icons/fa";

function Footer() {
  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-600 pt-5  md:pb-0">
      {" "}
      {/* Extra padding at the bottom for mobile */}
      <footer className="flex flex-col md:flex-row justify-between items-center px-6 md:px-10 space-y-8 md:space-y-0 md:py-8">
        {/* Left Section */}
        <div className="text-center md:text-left max-w-lg space-y-4">
          <h3 className="text-3xl font-bold text-white">
            Stay Connected with Us!
          </h3>
          <p className="text-lg text-gray-200">
            Follow us to learn about our latest news, updates, and adventures in
            the world of data science.
          </p>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4 md:space-x-6">
          {/* WhatsApp Icon */}
          <Link
            href="https://chat.whatsapp.com/JPlO3NzxSBf9LkG9uYspoA"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Join us on WhatsApp"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg transition-transform duration-300 hover:scale-110 mb-4 md:mb-0">
              <FaWhatsapp className="text-green-500 text-3xl" />
            </div>
          </Link>

          {/* Instagram Icon */}
          <Link
            href="https://www.instagram.com/datasciencestudentclubjntuh/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow us on Instagram"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg transition-transform duration-300 hover:scale-110 mb-4 md:mb-0">
              <FaInstagram className="text-pink-500 text-3xl" />
            </div>
          </Link>

          {/* LinkedIn Icon */}
          <Link
            href="https://www.linkedin.com/company/data-science-student-club/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow us on LinkedIn"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg transition-transform duration-300 hover:scale-110 mb-4 md:mb-0">
              <FaLinkedin className="text-blue-500 text-3xl" />
            </div>
          </Link>
        </div>
      </footer>
      {/* Bottom Section */}
      <div className="bg-gray-700 text-center py-4">
        <p className="text-sm text-gray-300">
          © 2024 Data Science Club | All Rights Reserved
        </p>
      </div>
    </div>
  );
}

export default Footer;
