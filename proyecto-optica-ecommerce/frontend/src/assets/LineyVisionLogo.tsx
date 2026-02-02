import React from 'react';

interface LineyVisionLogoProps {
  size?: number;
  className?: string;
}

const LineyVisionLogo: React.FC<LineyVisionLogoProps> = ({ size = 200, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Golden glow gradient */}
        <linearGradient id="goldGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="50%" stopColor="#FFF8DC" />
          <stop offset="100%" stopColor="#FFD700" />
        </linearGradient>
        
        {/* Eye glow - golden */}
        <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF8DC" />
          <stop offset="60%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#B8860B" />
        </radialGradient>
        
        {/* Glasses frame gradient - shiny gold */}
        <linearGradient id="glassesGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#B8860B" />
          <stop offset="25%" stopColor="#FFD700" />
          <stop offset="50%" stopColor="#FFFACD" />
          <stop offset="75%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#B8860B" />
        </linearGradient>
        
        {/* Owl body - dark with subtle gradient */}
        <linearGradient id="owlBody" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#1a1a1a" />
          <stop offset="100%" stopColor="#0d0d0d" />
        </linearGradient>
        
        {/* Strong gold glow filter */}
        <filter id="goldGlowFilter" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feFlood floodColor="#FFD700" floodOpacity="0.8" />
          <feComposite in2="blur" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        {/* Intense glow for eyes */}
        <filter id="eyeGlowFilter" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feFlood floodColor="#FFD700" floodOpacity="1" />
          <feComposite in2="blur" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        {/* Outer stroke glow */}
        <filter id="strokeGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feFlood floodColor="#FFD700" floodOpacity="0.9" />
          <feComposite in2="blur" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Owl ears/horns - with gold glow stroke */}
      <path
        d="M55 55 L70 80 L60 75 Z"
        fill="url(#owlBody)"
        stroke="url(#goldGlow)"
        strokeWidth="2"
        filter="url(#strokeGlow)"
      />
      <path
        d="M145 55 L130 80 L140 75 Z"
        fill="url(#owlBody)"
        stroke="url(#goldGlow)"
        strokeWidth="2"
        filter="url(#strokeGlow)"
      />

      {/* Owl head - geometric with gold outline */}
      <ellipse
        cx="100"
        cy="100"
        rx="55"
        ry="50"
        fill="url(#owlBody)"
        stroke="url(#goldGlow)"
        strokeWidth="2.5"
        filter="url(#strokeGlow)"
      />

      {/* Inner face detail - subtle */}
      <ellipse
        cx="100"
        cy="105"
        rx="40"
        ry="35"
        fill="#1f1f1f"
        opacity="0.7"
      />

      {/* Glasses frame - intense gold glow */}
      <g filter="url(#goldGlowFilter)">
        {/* Left lens frame */}
        <ellipse
          cx="72"
          cy="95"
          rx="24"
          ry="20"
          fill="none"
          stroke="url(#glassesGradient)"
          strokeWidth="3.5"
        />
        
        {/* Right lens frame */}
        <ellipse
          cx="128"
          cy="95"
          rx="24"
          ry="20"
          fill="none"
          stroke="url(#glassesGradient)"
          strokeWidth="3.5"
        />
        
        {/* Bridge */}
        <path
          d="M96 95 Q100 88 104 95"
          fill="none"
          stroke="url(#glassesGradient)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        
        {/* Temple arms */}
        <path
          d="M46 90 L52 94"
          stroke="url(#glassesGradient)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M154 90 L148 94"
          stroke="url(#glassesGradient)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>

      {/* Eyes - intense golden glow */}
      <circle
        cx="72"
        cy="95"
        r="12"
        fill="url(#eyeGlow)"
        filter="url(#eyeGlowFilter)"
      />
      <circle
        cx="128"
        cy="95"
        r="12"
        fill="url(#eyeGlow)"
        filter="url(#eyeGlowFilter)"
      />
      
      {/* Pupils - dark */}
      <circle cx="74" cy="94" r="4" fill="#0a0a0a" />
      <circle cx="130" cy="94" r="4" fill="#0a0a0a" />
      
      {/* Eye highlights - bright gold */}
      <circle cx="69" cy="91" r="2.5" fill="#FFFACD" opacity="0.95" />
      <circle cx="125" cy="91" r="2.5" fill="#FFFACD" opacity="0.95" />

      {/* Beak - golden */}
      <path
        d="M100 115 L94 126 L100 132 L106 126 Z"
        fill="#B8860B"
        stroke="#FFD700"
        strokeWidth="1.5"
        filter="url(#strokeGlow)"
      />

      {/* Subtle feather accent lines - gold */}
      <path
        d="M58 122 Q70 138 82 142"
        fill="none"
        stroke="#FFD700"
        strokeWidth="1.5"
        opacity="0.5"
        filter="url(#strokeGlow)"
      />
      <path
        d="M142 122 Q130 138 118 142"
        fill="none"
        stroke="#FFD700"
        strokeWidth="1.5"
        opacity="0.5"
        filter="url(#strokeGlow)"
      />
    </svg>
  );
};

export default LineyVisionLogo;
