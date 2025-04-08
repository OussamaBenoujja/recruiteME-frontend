// src/components/navbar.js
import React from "react";

function Navbar() {
  return (
    <div className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Navbar</h1>
        <ul className="flex space-x-6">
          <li className="hover:text-blue-300 cursor-pointer">Home</li>
          <li className="hover:text-blue-300 cursor-pointer">About</li>
          <li className="hover:text-blue-300 cursor-pointer">Contact</li>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;