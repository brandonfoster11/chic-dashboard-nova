import React from 'react';

export const OutfitManagementImage = () => (
  <svg width="100%" height="100%" viewBox="0 0 500 800" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#f5f0ff" rx="30" ry="30" />
    <text x="50%" y="100" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#333">Manage your outfits</text>
    
    {/* Person illustration */}
    <g transform="translate(250, 350) scale(1.2)">
      {/* Head */}
      <ellipse cx="0" cy="-80" rx="25" ry="30" fill="#f4d7c3" />
      <path d="M-15,-100 Q0,-115 15,-100 Q25,-90 15,-80 Q5,-75 -5,-75 Q-15,-75 -25,-85 Q-20,-95 -15,-100" fill="#333" />
      
      {/* Body - White T-shirt */}
      <rect x="-25" y="-50" width="50" height="70" rx="10" fill="#fff" />
      
      {/* Plaid Shirt */}
      <rect x="-40" y="-50" width="80" height="80" rx="5" fill="#d9c2a3" />
      <g stroke="#a58b66" strokeWidth="2">
        <line x1="-40" y1="-40" x2="40" y2="-40" />
        <line x1="-40" y1="-20" x2="40" y2="-20" />
        <line x1="-40" y1="0" x2="40" y2="0" />
        <line x1="-40" y1="20" x2="40" y2="20" />
        <line x1="-20" y1="-50" x2="-20" y2="30" />
        <line x1="0" y1="-50" x2="0" y2="30" />
        <line x1="20" y1="-50" x2="20" y2="30" />
      </g>
      
      {/* Arms */}
      <rect x="-40" y="-50" width="15" height="80" rx="5" fill="#d9c2a3" />
      <rect x="25" y="-50" width="15" height="80" rx="5" fill="#d9c2a3" />
      
      {/* Hands */}
      <ellipse cx="-32.5" cy="40" rx="7.5" ry="10" fill="#f4d7c3" />
      <ellipse cx="32.5" cy="40" rx="7.5" ry="10" fill="#f4d7c3" />
      
      {/* Navy Pants */}
      <rect x="-25" y="30" width="50" height="100" rx="5" fill="#2c3e50" />
      <rect x="-25" y="30" width="20" height="100" rx="2" fill="#34495e" />
      
      {/* Brown Shoes */}
      <ellipse cx="-15" cy="140" rx="15" ry="10" fill="#8b4513" />
      <ellipse cx="15" cy="140" rx="15" ry="10" fill="#8b4513" />
    </g>
    
    {/* Text and UI elements */}
    <text x="50%" y="550" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#333">Wardrobe suggestion</text>
    
    {/* Slider 1 */}
    <g transform="translate(0, 600)">
      <circle cx="160" cy="0" r="20" fill="#e0e0e0" />
      <rect x="180" y="-2" width="200" height="4" rx="2" fill="#e0e0e0" />
      <circle cx="280" cy="0" r="15" fill="#a78bfa" />
    </g>
    
    {/* Slider 2 */}
    <g transform="translate(0, 650)">
      <circle cx="160" cy="0" r="20" fill="#e0e0e0" />
      <rect x="180" y="-2" width="200" height="4" rx="2" fill="#e0e0e0" />
      <circle cx="280" cy="0" r="15" fill="#a78bfa" />
    </g>
    
    {/* Bottom navigation */}
    <g transform="translate(0, 720)">
      <circle cx="220" cy="0" r="30" fill="#fff" stroke="#6c7a89" strokeWidth="2" />
      <circle cx="300" cy="0" r="30" fill="#fff" stroke="#6c7a89" strokeWidth="2" />
      <circle cx="380" cy="0" r="30" fill="#fff" stroke="#6c7a89" strokeWidth="2" />
      <circle cx="140" cy="0" r="30" fill="#fff" stroke="#6c7a89" strokeWidth="2" />
      
      {/* Icons */}
      <g transform="translate(140, 0) scale(0.5)">
        <rect x="-15" y="-15" width="30" height="30" fill="#6c7a89" />
      </g>
      <g transform="translate(220, 0) scale(0.5)">
        <circle cx="0" cy="-5" r="10" fill="#6c7a89" />
        <path d="M-10,5 Q0,20 10,5" fill="none" stroke="#6c7a89" strokeWidth="4" />
      </g>
      <g transform="translate(300, 0) scale(0.5)">
        <line x1="-10" y1="0" x2="10" y2="0" stroke="#6c7a89" strokeWidth="4" />
        <line x1="0" y1="-10" x2="0" y2="10" stroke="#6c7a89" strokeWidth="4" />
      </g>
      <g transform="translate(380, 0) scale(0.5)">
        <path d="M0,-10 L10,10 L-10,10 Z" fill="none" stroke="#6c7a89" strokeWidth="4" />
        <path d="M-10,-5 Q0,10 10,-5" fill="none" stroke="#6c7a89" strokeWidth="4" />
      </g>
    </g>
  </svg>
);
