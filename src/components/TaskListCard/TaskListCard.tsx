import { useNavigate } from 'react-router-dom';
import {
  MdMenuBook, MdScience, MdArchitecture,
  MdLanguage, MdFunctions, MdAccessTime,
} from 'react-icons/md';
import type { TaskList } from '../../types/TaskList';

// Mismas constantes que el móvil — se pueden importar donde se necesiten
export const ACCENT_COLORS: Record<string, string> = {
  PRIMARY_BLUE: '#3B82F6',
  SLATE:        '#4B5563',
  FOREST_GREEN: '#16A34A',
  PURPLE:       '#7C3AED',
  RED:          '#EF4444',
  ORANGE:       '#F59E0B',
  TEAL:         '#14B8A6',
  CUSTOM:       '#6B7280',
};

// react-icons reemplaza a MaterialIcons de Expo
const ICON_MAP: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  book:    MdMenuBook,
  flask:   MdScience,
  compass: MdArchitecture,
  globe:   MdLanguage,
  sigma:   MdFunctions,
};

const CATEGORY_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  CORE_SCIENCE: { bg: '#DBEAFE', text: '#1D4ED8', label: 'CORE SCIENCE' },
  HUMANITIES:   { bg: '#DCFCE7', text: '#15803D', label: 'HUMANITIES' },
  MATH:         { bg: '#EDE9FE', text: '#6D28D9', label: 'MATH' },
  ENGINEERING:  { bg: '#FEF3C7', text: '#B45309', label: 'ENGINEERING' },
  GENERAL:      { bg: '#F3F4F6', text: '#374151', label: 'GENERAL' },
};

function formatLastSession(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffH = Math.floor(diffMs / 3_600_000);
  if (diffH < 1) return 'Last session just now';
  if (diffH < 24) return `Last session ${diffH}h ago`;
  return `Last session ${Math.floor(diffH / 24)}d ago`;
}

export default function TaskListCard({ item }: { item: TaskList }) {
  const navigate = useNavigate();
  const accentHex = ACCENT_COLORS[item.idColor] ?? ACCENT_COLORS.PRIMARY_BLUE;
  const IconComponent = ICON_MAP[item.idIcon] ?? MdMenuBook;
  const cat = CATEGORY_STYLES[item.tags[0] ?? 'GENERAL'] ?? CATEGORY_STYLES.GENERAL;
  const lastSession = formatLastSession(item.lastSessionAt);
  const pct = Math.min(Math.max(item.percentage, 0), 100);

  return (
    <div
      onClick={() => navigate(`/lists/${item.id}`)}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.10)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; }}
      style={{
        display: 'flex',
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 12,
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        cursor: 'pointer',
      }}
    >
      {/* Borde izquierdo de acento */}
      <div style={{ width: 4, backgroundColor: accentHex, flexShrink: 0 }} />

      <div style={{ flex: 1, padding: 14 }}>
        {/* Pill de categoría + ícono */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{
            backgroundColor: cat.bg,
            color: cat.text,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 0.5,
            padding: '3px 8px',
            borderRadius: 20,
          }}>
            {cat.label}
          </span>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            backgroundColor: accentHex + '20',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <IconComponent size={18} color={accentHex} />
          </div>
        </div>

        {/* Título */}
        <div style={{
          fontSize: 17,
          fontWeight: 700,
          color: '#111827',
          marginBottom: 2,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {item.title}
        </div>

        {/* Topic / subtítulo */}
        {(item.topicLabel ?? item.subtitle) ? (
          <div style={{
            fontSize: 13,
            color: '#6B7280',
            marginBottom: 10,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {item.topicLabel ?? item.subtitle}
          </div>
        ) : null}

        {/* Barra de progreso */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{ flex: 1, height: 6, backgroundColor: '#E5E7EB', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{
              width: `${pct}%`,
              height: '100%',
              backgroundColor: accentHex,
              borderRadius: 99,
              transition: 'width 0.3s ease',
            }} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: accentHex, minWidth: 36, textAlign: 'right' }}>
            {item.percentage}%
          </span>
        </div>

        {/* Last session */}
        {lastSession && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <MdAccessTime size={12} color="#9CA3AF" />
            <span style={{ fontSize: 11, color: '#9CA3AF' }}>{lastSession}</span>
          </div>
        )}
      </div>
    </div>
  );
}
