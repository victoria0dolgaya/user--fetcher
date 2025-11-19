import { NavLink, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";


export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Toaster position="top-center" />
      <nav className="bg-blue-500 text-white py-4 shadow-md">
        <ul className="flex justify-center gap-6 sm:gap-6 text-sm sm:text-lg font-medium">
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg transition-all duration-300 ${
                  isActive
                    ? "bg-white text-blue-600 shadow-sm"
                    : "hover:bg-blue-600"
                }`
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/saved"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg transition-all duration-300 ${
                  isActive
                    ? "bg-white text-blue-600 shadow-sm"
                    : "hover:bg-blue-600"
                }`
              }
            >
              Saved Users
            </NavLink>
          </li>
        </ul>
      </nav>

      <main className="flex-grow bg-gray-100 p-10">
        <Outlet />
      </main>

      <footer className="bg-blue-500 w-full text-center py-6 text-sm text-white border-t border-gray-300">
        ©{new Date().getFullYear()} User Fetching App by Victoria
      </footer>
    </div>
  );
}
