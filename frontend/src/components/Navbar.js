import React, { useState } from "react";

const Navbar = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);

  const toggleNavbar = () => {
    setNavbarOpen(!navbarOpen);
  };

  return (
    <header className="flex w-full items-center bg-gray-900 text-white">
      <div className="container mx-auto">
        <div className="relative -mx-4 flex items-center justify-between">
          <div className="w-20">
            <a href="/" className="block w-full">
              <img
                src="favicons/mstile-150x150.png"
                alt="logo"
                className="w-full"
              />
            </a>
          </div>
          <div className="flex w-full items-center justify-between px-4">
            <div>
              <button
                onClick={toggleNavbar}
                className={`absolute right-4 top-1/2 block -translate-y-1/2 rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden ${
                  navbarOpen ? "navbarTogglerActive" : ""
                }`}
              >
                <span className="relative my-[6px] block h-[2px] w-[30px] bg-white"></span>
                <span className="relative my-[6px] block h-[2px] w-[30px] bg-white"></span>
                <span className="relative my-[6px] block h-[2px] w-[30px] bg-white"></span>
              </button>
              <nav
                className={`absolute right-4 top-full w-full max-w-[250px] rounded-lg bg-gray-900 py-5 px-6 shadow-lg lg:static lg:block lg:w-full lg:max-w-full lg:shadow-none ${
                  !navbarOpen ? "hidden" : ""
                }`}
              >
                <ul className="block lg:flex">
                  <li>
                    <a
                      href="/"
                      className="flex py-2 text-base font-medium hover:text-primary lg:ml-12 lg:inline-flex"
                    >
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <a
                      href="/"
                      className="flex py-2 text-base font-medium hover:text-primary lg:ml-12 lg:inline-flex"
                    >
                      Moderator
                    </a>
                  </li>
                  <li>
                    <a
                      href="/"
                      className="flex py-2 text-base font-medium hover:text-primary lg:ml-12 lg:inline-flex"
                    >
                      Editor
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="hidden justify-end pr-16 sm:flex lg:pr-0">
              <a
                href="/"
                className="py-3 px-7 text-base font-medium hover:text-primary"
              >
                Log out
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
