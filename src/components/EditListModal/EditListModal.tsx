import { useState, useEffect } from 'react';
import { MdClose, MdCheck, MdMenuBook, MdScience, MdArchitecture, MdLanguage, MdFunctions } from 'react-icons/md';
import { updateList } from '../../services/lists/listService';
import type { UpdateListPayload } from '../../services/lists/listService';
import type { ListDetail } from '../../types/Task';
import { ACCENT_COLORS } from '../TaskListCard/TaskListCard';

const COLORS = [
  { key: 'PRIMARY_BLUE',  hex: ACCENT_COLORS.PRIMARY_BLUE,  label: 'Primary Blue' },
  { key: 'SLATE',         hex: ACCENT_COLORS.SLATE,         label: 'Slate' },
  { key: 'FOREST_GREEN',  hex: ACCENT_COLORS.FOREST_GREEN,  label: 'Forest Green' },
  { key: 'PURPLE',        hex: ACCENT_COLORS.PURPLE,        label: 'Purple' },
  { key: 'RED',           hex: ACCENT_COLORS.RED,           label: 'Red' },
  { key: 'ORANGE',        hex: ACCENT_COLORS.ORANGE,        label: 'Orange' },
  { key: 'TEAL',          hex: ACCENT_COLORS.TEAL,          label: 'Teal' },
];

const ICONS = [
  { key: 'book',    Icon: MdMenuBook },
  { key: 'flask',   Icon: MdScience },
  { key: 'compass', Icon: MdArchitecture },
  { key: 'globe',   Icon: MdLanguage },
  { key: 'sigma',   Icon: MdFunctions },
];

type Props = {
  visible: boolean;
  list: ListDetail | null;
  onSaved: (updated: ListDetail) => void;
  onClose: () => void;
};

export default function EditListModal({ visible, list, onSaved, onClose }: Props) {
  const [title, setTitle]                   = useState('');
  const [description, setDescription]       = useState('');
  const [selectedColor, setSelectedColor]   = useState('PRIMARY_BLUE');
  const [selectedIcon, setSelectedIcon]     = useState('book');
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState('');

  // Precarga el formulario cada vez que se abre con una lista diferente
  useEffect(() => {
    if (list) {
      setTitle(list.title ?? '');
      setDescription(list.description ?? '');
      setSelectedColor(list.accentColor ?? 'PRIMARY_BLUE');
      setSelectedIcon(list.icon ?? 'book');
      setError('');
    }
  }, [list]);

  const handleSubmit = async () => {
    if (!title.trim()) { setError('El título es obligatorio'); return; }
    if (!list) return;
    setLoading(true);
    setError('');
    try {
      const payload: UpdateListPayload = {
        title: title.trim(),
        description: description.trim() || undefined,
        accentColor: selectedColor,
        icon: selectedIcon,
      };
      const updated = await updateList(list.id, payload);
      setLoading(false);
      onSaved(updated);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message ?? 'No se pudo guardar');
      setLoading(false);
    }
  };

  if (!visible) return null;

  const accentHex = ACCENT_COLORS[selectedColor] ?? ACCENT_COLORS.PRIMARY_BLUE;

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ backgroundColor: '#fff', borderRadius: 20, width: '100%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #F3F4F6' }}>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
            <MdClose size={22} color="#374151" />
          </button>
          <span style={{ fontSize: 17, fontWeight: 600, color: '#111827' }}>Edit List</span>
          <div style={{ width: 30 }} />
        </div>

        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {error && (
            <div style={{ backgroundColor: '#FEF2F2', borderLeft: '3px solid #EF4444', padding: '12px 14px', borderRadius: 10, color: '#DC2626', fontSize: 13 }}>
              {error}
            </div>
          )}

          {/* Título */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: 0.8, marginBottom: 8 }}>LIST TITLE *</label>
            <input
              type="text"
              value={title}
              onChange={e => { setTitle(e.target.value); setError(''); }}
              placeholder="e.g. Computer Science Finals"
              style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: `1px solid ${error && !title.trim() ? '#EF4444' : '#E5E7EB'}`, backgroundColor: '#F9FAFB', fontSize: 15, boxSizing: 'border-box', color: '#111827', outline: 'none' }}
            />
          </div>

          {/* Descripción */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: 0.8, marginBottom: 8 }}>DESCRIPTION (OPTIONAL)</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Notes about this collection..."
              rows={3}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', fontSize: 15, boxSizing: 'border-box', resize: 'none', color: '#111827', fontFamily: 'inherit', outline: 'none' }}
            />
          </div>

          {/* Color */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: 0.8 }}>ACCENT COLOR</label>
              <span style={{ fontSize: 10, fontWeight: 700, color: accentHex, border: `1px solid ${accentHex}`, borderRadius: 20, padding: '2px 8px' }}>
                {COLORS.find(c => c.key === selectedColor)?.label.toUpperCase()}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {COLORS.map(c => (
                <button
                  key={c.key}
                  onClick={() => setSelectedColor(c.key)}
                  style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: c.hex, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: selectedColor === c.key ? '0 2px 8px rgba(0,0,0,0.25)' : 'none' }}
                >
                  {selectedColor === c.key && <MdCheck size={18} color="#fff" />}
                </button>
              ))}
            </div>
          </div>

          {/* Ícono */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: 0.8, marginBottom: 10 }}>LIBRARY ICON</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {ICONS.map(({ key, Icon }) => {
                const isSelected = selectedIcon === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedIcon(key)}
                    style={{ width: 52, height: 52, borderRadius: 12, backgroundColor: isSelected ? '#EFF6FF' : '#F9FAFB', border: `1px solid ${isSelected ? 'transparent' : '#E5E7EB'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}
                  >
                    <Icon size={24} color={isSelected ? accentHex : '#6B7280'} />
                    {isSelected && <div style={{ position: 'absolute', bottom: 5, width: 20, height: 2, backgroundColor: accentHex, borderRadius: 1 }} />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '0 24px 24px' }}>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ width: '100%', padding: 16, backgroundColor: loading ? '#9CA3AF' : accentHex, color: '#fff', border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Guardando...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
