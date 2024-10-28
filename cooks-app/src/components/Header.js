import React, { useState, useEffect, useRef } from 'react';
import '../styles/Header.css';

const Header = ({ setContentMessage }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false); // State for notifications dropdown
  const [isToggled, setIsToggled] = useState(false);
  const [tooltip, setTooltip] = useState(''); // Tooltip state

  // Ref for the header component
  const headerRef = useRef();

  // Function to close all dropdowns
  const closeAllDropdowns = () => {
    setIsProfileOpen(false);
    setIsQuickActionsOpen(false);
    setIsNotificationsOpen(false);
  };

  // Effect to handle clicks outside of the header
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        closeAllDropdowns(); // Close dropdowns if clicked outside
      }
    };

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Cleanup the event listener
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleProfile = () => {
    setIsProfileOpen((prev) => !prev);
    setIsQuickActionsOpen(false); // Close other dropdowns
    setIsNotificationsOpen(false); // Close notifications dropdown
  };

  const toggleQuickActions = () => {
    setIsQuickActionsOpen((prev) => !prev);
    setIsProfileOpen(false); // Close other dropdowns
    setIsNotificationsOpen(false); // Close notifications dropdown
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen((prev) => !prev);
    setIsProfileOpen(false); // Close profile dropdown
    setIsQuickActionsOpen(false); // Close quick actions dropdown
  };

  const handleProfileClick = (action) => {
    setContentMessage(`This page is for ${action.toLowerCase()}.`);
    closeAllDropdowns(); // Close dropdowns after click
  };

  const handleQuickActionsClick = (action) => {
    setContentMessage(`This page is to ${action.toLowerCase()}.`);
    closeAllDropdowns(); // Close dropdowns after click
  };

  const handleNotificationsClick = (action) => {
    setContentMessage(`This page is for ${action.toLowerCase()}.`);
    closeAllDropdowns(); // Close dropdowns after click
  };

  // Handle toggle switch
  const handleToggle = () => {
    setIsToggled(!isToggled); // Toggle between on and off
    setContentMessage(`The toggle is now ${!isToggled ? 'On' : 'Off'}`);
  };

  // Handle tooltip hover
  const handleMouseOver = (name) => {
    setTooltip(name); // Show tooltip when hovered
  };

  const handleMouseOut = () => {
    setTooltip(''); // Hide tooltip when mouse leaves
  };

  return (
    <div className="header" ref={headerRef}>
      <div className="header-left">COOK</div>
      <div className="header-right">
        {/* Profile Icon */}
        <div
          className="icon profile-icon"
          onClick={toggleProfile}
          onMouseOver={() => handleMouseOver('Profile')}
          onMouseOut={handleMouseOut}
        >
          👤
          {tooltip === 'Profile' && <div className="tooltip">Profile</div>}
          {isProfileOpen && (
            <div className="dropdown">
              <ul>
                <li onClick={() => handleProfileClick('Profile Settings')}>Profile Settings</li>
                <li onClick={() => handleProfileClick('Logout')}>Logout</li>
              </ul>
            </div>
          )}
        </div>

        {/* Notifications Icon */}
        <div
          className="icon notifications-icon"
          onClick={toggleNotifications}
          onMouseOver={() => handleMouseOver('Notifications')}
          onMouseOut={handleMouseOut}
        >
          🔔
          {tooltip === 'Notifications' && <div className="tooltip">Notifications</div>}
          {isNotificationsOpen && (
            <div className="dropdown">
              <ul>
                <li onClick={() => handleNotificationsClick('New Orders')}>New Orders</li>
                <li onClick={() => handleNotificationsClick('Customer Messages')}>Customer Messages</li>
                <li onClick={() => handleNotificationsClick('Reviews')}>Reviews</li>
                <li onClick={() => handleNotificationsClick('System Updates')}>System Updates</li>
              </ul>
            </div>
          )}
        </div>

        {/* Quick Actions Icon */}
        <div
          className="icon quick-actions-icon"
          onClick={toggleQuickActions}
          onMouseOver={() => handleMouseOver('Quick Actions')}
          onMouseOut={handleMouseOut}
        >
          ⚡
          {tooltip === 'Quick Actions' && <div className="tooltip">Quick Actions</div>}
          {isQuickActionsOpen && (
            <div className="dropdown">
              <ul>
                <li onClick={() => handleQuickActionsClick('Add New Dish')}>Add New Dish</li>
                <li onClick={() => handleQuickActionsClick('View Incoming Orders')}>View Incoming Orders</li>
                <li onClick={() => handleQuickActionsClick('Check Messages')}>Check Messages</li>
              </ul>
            </div>
          )}
        </div>

        {/* Toggle Switch */}
        <div
          className="toggle-switch"
          onMouseOver={() => handleMouseOver(isToggled ? 'Available' : 'Not Available')}
          onMouseOut={handleMouseOut}
        >
          <label className="switch">
            <input type="checkbox" checked={isToggled} onChange={handleToggle} />
            <span className="slider"></span>
          </label>
          <span className="toggle-label">{isToggled ? 'On' : 'Off'}</span>
          {tooltip === (isToggled ? 'Available' : 'Not Available') && (
            <div className="tooltip">{isToggled ? 'Available' : 'Not Available'}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
