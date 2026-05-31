import { MdDelete } from 'react-icons/md';

type Props = {
  visible: boolean;
  title: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function DeleteConfirmModal({ visible, title, loading = false, onConfirm, onCancel }: Props) {
  if (!visible) return null;

  return (
    <div
      onClick={onCancel}
      style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: 24 }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ backgroundColor: '#fff', borderRadius: 20, padding: 28, width: '100%', maxWidth: 340, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        {/* Ícono */}
        <div style={{ width: 60, height: 60, borderRadius: '50%', backgroundColor: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <MdDelete size={28} color="#EF4444" />
        </div>

        <h3 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: '0 0 10px 0' }}>
          ¿Eliminar?
        </h3>
        <p style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 1.6, margin: '0 0 24px 0' }}>
          ¿Estás seguro de que deseas eliminar<br />
          <strong style={{ color: '#374151' }}>"{title}"</strong>?<br />
          Esta acción no se puede deshacer.
        </p>

        <button
          onClick={onConfirm}
          disabled={loading}
          style={{ width: '100%', padding: 15, backgroundColor: loading ? '#9CA3AF' : '#DC2626', color: '#fff', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', marginBottom: 10 }}
        >
          {loading ? 'Eliminando...' : 'Eliminar'}
        </button>

        <button
          onClick={onCancel}
          disabled={loading}
          style={{ width: '100%', padding: 15, backgroundColor: '#F3F4F6', color: '#374151', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
