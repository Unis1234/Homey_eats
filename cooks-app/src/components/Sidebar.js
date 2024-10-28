import React, { useState } from 'react';
import '../styles/Sidebar.css';

const sections = [
  {
    icon: '🏠',
    name: 'Dashboard',
    submenus: ['Total Orders', 'Earnings Summary', 'Pending Orders', 'Customer Feedback Summary', 'Performance Graphs'],
  },
  {
    icon: '🍽️',
    name: 'Menu Management',
    submenus: ['Manage Menu', 'Add New Dish', 'Categories', 'Special Offers'],
  },
  {
    icon: '📦',
    name: 'Order Management',
    submenus: ['Incoming Orders', 'Order History', 'Order Alerts'],
  },
  {
    icon: '💬',
    name: 'Customer Interaction',
    submenus: ['Messages', 'Reviews', 'Order Follow-up'],
  },
  {
    icon: '📊',
    name: 'Earnings & Analytics',
    submenus: ['Overview', 'Order Trends', 'Payout Management'],
  },
  {
    icon: '⚙️',
    name: 'Settings and Support',
    submenus: ['Account Settings', 'Help & Support', 'Store Availability'],
  },
  {
    icon: '🔔',
    name: 'Notifications & Alerts',
    submenus: ['Notifications for orders', 'System updates'],
  },
  {
    icon: '📦',
    name: 'Inventory Management',
    submenus: ['Track stock', 'Low inventory alerts'],
  },
];

const Sidebar = ({ setContentMessage }) => {
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (sectionName) => {
    setActiveSection(activeSection === sectionName ? null : sectionName);
  };

  const handleSubmenuClick = (submenu) => {
    setContentMessage(`This page is to ${submenu.toLowerCase()}.`);
  };

  return (
    <div className="sidebar">
      {sections.map((section) => (
        <div key={section.name} className="sidebar-item">
          <div className="section-header" onClick={() => toggleSection(section.name)}>
            <span className="icon">{section.icon}</span>
            <span className="section-name">{section.name}</span>
          </div>
          {activeSection === section.name && (
            <ul className="submenus">
              {section.submenus.map((submenu) => (
                <li key={submenu} onClick={() => handleSubmenuClick(submenu)}>
                  {submenu}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
