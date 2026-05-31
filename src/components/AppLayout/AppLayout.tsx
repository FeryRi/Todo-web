import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MdMenuBook, MdHome, MdSearch, MdPerson, MdLogout } from 'react-icons/md';
import { useAuth } from '../../hooks/useAuth';
import type { ReactNode } from 'react';

const NAV_ITEMS = [
  { to: '/', label: 'Inicio', Icon: MdHome },
  { to: '/search', label: 'Búsqueda', Icon: MdSearch },
  { to: '/about', label: 'Perfil', Icon: MdPerson },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      {/* Sidebar — equivalente a las tabs del móvil */}
      <aside style={{
        width: 220,
        backgroundColor: '#fff',
        borderRight: '1px solid #F3F4F6',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 0',
        flexShrink: 0,
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 20px', marginBottom: 32 }}>
          <MdMenuBook size={22} color="#3B82F6" />
          <span style={{ fontSize: 17, fontWeight: 700, color: '#3B82F6' }}>EduTask</span>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, padding: '0 12px' }}>
          {NAV_ITEMS.map(({ to, label, Icon }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  borderRadius: 10,
                  textDecoration: 'none',
                  fontWeight: 500,
                  fontSize: 14,
                  backgroundColor: active ? '#EFF6FF' : 'transparent',
                  color: active ? '#3B82F6' : '#374151',
                }}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: '0 12px' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 10,
              width: '100%',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              color: '#EF4444',
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            <MdLogout size={18} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main style={{ flex: 1, overflowY: 'auto', padding: 32 }}>
        {children}
      </main>
    </div>
  );
}
