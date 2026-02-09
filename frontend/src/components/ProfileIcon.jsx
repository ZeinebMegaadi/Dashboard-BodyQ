import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from 'lucide-react';

const navStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '44px',
  height: '44px',
  borderRadius: '50%',
  background: 'rgba(255,255,255,0.1)',
  color: 'white',
  border: '2px solid transparent',
  transition: 'background 0.2s, border-color 0.2s',
};

export default function ProfileIcon() {
  const location = useLocation();
  const isProfile = location.pathname === '/profile';

  return (
    <Link
      to="/profile"
      aria-label="Open profile"
      style={{
        ...navStyle,
        ...(isProfile ? { borderColor: 'var(--color-accent-lime)', background: 'rgba(205, 242, 126, 0.15)' } : {}),
      }}
      onMouseEnter={(e) => {
        if (!isProfile) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isProfile) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
        }
      }}
    >
      <User size={22} strokeWidth={2} />
    </Link>
  );
}
