import { MdCode, MdPalette } from 'react-icons/md';
import AppLayout from '../../components/AppLayout/AppLayout';
import avatarImg from '../../assets/IMG_5683.png';

const PROJECT = {
  name: 'Todo',
  description:
    'Aplicación web de to-do que permite crear temas o tareas con sus subtareas a completar, eliminarlas, completarlas, editarlas y buscar tanto tareas/módulos o subtareas en curso como completadas.',
  tags: ['REACT', 'WEB UI', 'VITE + TYPESCRIPT'],
};

const AUTHOR = {
  role: 'estudiante',
  name: 'Fernanda Ríos Juárez',
  interests: [
    { Icon: MdCode,    label: 'INTEREST', value: 'Redes' },
    { Icon: MdPalette, label: 'HOBBIES',  value: 'Bailar, cantar, anime' },
  ],
  quote: '"これあまり好きではないなのでもう辞めたい"',
};

// Tarjeta con borde izquierdo azul — igual que el móvil
function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex',
      backgroundColor: '#fff',
      borderRadius: 18,
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      marginBottom: 20,
    }}>
      <div style={{ width: 4, backgroundColor: '#3B82F6', flexShrink: 0 }} />
      <div style={{ flex: 1, padding: 18 }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: '#111827', margin: '0 0 12px 0' }}>
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}

export default function About() {
  return (
    <AppLayout>
      {/* About the Project */}
      <SectionCard title="About the Project">
        <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.6, margin: 0 }}>
          <span style={{ fontWeight: 700, color: '#3B82F6' }}>{PROJECT.name} </span>
          {PROJECT.description}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
          {PROJECT.tags.map(tag => (
            <span
              key={tag}
              style={{ backgroundColor: '#EFF6FF', color: '#3B82F6', fontSize: 11, fontWeight: 700, letterSpacing: 0.5, padding: '5px 12px', borderRadius: 20 }}
            >
              {tag}
            </span>
          ))}
        </div>
      </SectionCard>

      {/* About Me */}
      <SectionCard title="About Me">
        {/* Tarjeta de perfil */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          backgroundColor: '#F9FAFB',
          borderRadius: 14,
          padding: 14,
          marginBottom: 14,
        }}>
          <img
            src={avatarImg}
            alt={AUTHOR.name}
            style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
          />

          <div>
            <p style={{ fontSize: 10, fontWeight: 700, color: '#3B82F6', letterSpacing: 1, margin: '0 0 2px 0' }}>
              {AUTHOR.role.toUpperCase()}
            </p>
            <p style={{ fontSize: 18, fontWeight: 800, color: '#111827', margin: 0 }}>
              {AUTHOR.name}
            </p>
          </div>
        </div>

        {/* Tarjetas de intereses */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
          {AUTHOR.interests.map(({ Icon, label, value }) => (
            <div
              key={label}
              style={{ flex: 1, minWidth: 120, backgroundColor: '#F9FAFB', borderRadius: 12, padding: 12, display: 'flex', flexDirection: 'column', gap: 4 }}
            >
              <Icon size={20} color="#3B82F6" />
              <p style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: 0.8, margin: '2px 0 0 0' }}>
                {label}
              </p>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: 0 }}>
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Cita */}
        <p style={{ fontSize: 13, color: '#6B7280', fontStyle: 'italic', lineHeight: 1.6, textAlign: 'center', margin: 0 }}>
          {AUTHOR.quote}
        </p>
      </SectionCard>
    </AppLayout>
  );
}
