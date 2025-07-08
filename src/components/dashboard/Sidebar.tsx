import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SidebarIcons } from '../icons';
import logo from "../../../public/assets/AutoCredits_Logo.png";

const menuItems = [
  { name: 'Dashboard', icon: SidebarIcons.Dashboard, path: '/dashboard' },
  // { name: 'Leads', icon: SidebarIcons.Leads, path: '/dashboard/leads' },
  // { name: 'Inventory', icon: SidebarIcons.Inventory, path: '/dashboard/inventory' },
  // { name: 'Loans', icon: SidebarIcons.Loans, path: '/dashboard/loans' },
  { name: 'Insurance', icon: SidebarIcons.Insurance, path: '/dashboard/insurance' },
  // { name: 'User Management', icon: SidebarIcons.User, path: '/dashboard/user-management' },
  // Sales / Finance handled separately for dropdown
];

const salesDropdownItems = [
  { name: 'Sales Transaction', path: '/dashboard/sales' },
  { name: 'Payment Tracking,',path: '/dashboard/payment' },
  { name: 'Reports' },
];

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSalesOpen, setIsSalesOpen] = useState(false);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  const toggleMobileMenu = () => setIsMobileOpen(!isMobileOpen);
  const toggleSalesDropdown = () => setIsSalesOpen((prev) => !prev);

  // Helper to determine if any sales dropdown item is active
  const isSalesActive = location.pathname.startsWith('/dashboard/sales');

  return (
    <>
      {/* Hamburger Menu for Mobile */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleMobileMenu}
          className="p-2 bg-gray-200 rounded-md text-gray-800 hover:bg-gray-300"
          aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
        >
          {isMobileOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`bg-gray-100 space-y-6 py-7 px-2 fixed inset-y-0 left-0 z-40 transform transition-all duration-200 ease-in-out
          ${isCollapsed ? 'w-16' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0 md:w-${isCollapsed ? '16' : '64'}`}
      >
        {/* Logo Section */}
        <div className="px-2 flex items-center justify-between">
          <div
            className={`flex items-center justify-center h-12 rounded-md transition-all duration-200
              ${isCollapsed ? 'w-12' : 'w-full'}`}
          >
            {!isCollapsed && (
              <span className=" font-bold">
                <img src={logo} alt="Logo" />
              </span>
            )}
          </div>
          <button
            onClick={toggleCollapse}
            className="hidden md:block p-2  hover:bg-gray-200 rounded-md"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const IconComponent = item.icon;

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center px-4 py-3 rounded-md transition-colors duration-200
                  ${isActive ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'}`}
                title={isCollapsed ? item.name : ''}
              >
                <IconComponent />
                <span
                  className={`transition-opacity duration-200 ml-2 ${isCollapsed ? 'hidden' : 'block'}`}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}

          {/* Sales / Finance Dropdown */}
          <div className="relative">
            {/* <button
              type="button"
              onClick={toggleSalesDropdown}
              className={`flex items-center w-full px-4 py-3 rounded-md transition-colors duration-200
                ${isSalesActive ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'}`}
              title={isCollapsed ? 'Sales / Finance' : ''}
            >
              <SidebarIcons.Reports />
              <span className={`transition-opacity duration-200 ml-2 ${isCollapsed ? 'hidden' : 'block'}`}>
                Sales / Finance
              </span>
              <svg
                className={`ml-auto transition-transform duration-200 ${isSalesOpen ? 'rotate-180' : ''} ${isCollapsed ? 'hidden' : 'block'}`}
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button> */}
            {/* Dropdown menu */}
            {/* {isSalesOpen && !isCollapsed && (
              <div className="ml-4 mt-1 flex flex-col gap-2">
                {salesDropdownItems.map((subItem, idx) =>
                  subItem.path ? (
                    <Link
                      key={subItem.name}
                      to={subItem.path}
                      onClick={() => {
                        setIsSalesOpen(false);
                        setIsMobileOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 rounded-md bg-white text-gray-700 hover:bg-gray-200 border border-gray-200
                        ${location.pathname === subItem.path ? 'bg-gray-200 text-gray-900' : ''}`}
                    >
                      {subItem.name}
                    </Link>
                  ) : (
                    <button
                      key={subItem.name}
                      type="button"
                      className="w-full text-left px-4 py-2 rounded-md bg-white text-gray-400 border border-gray-200 cursor-not-allowed"
                      tabIndex={-1}
                      disabled
                    >
                      {subItem.name}
                    </button>
                  )
                )}
              </div>
            )} */}
          </div>
        </nav>
      </div>

      {/* Overlay for Mobile */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleMobileMenu}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
