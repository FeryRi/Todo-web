import { useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md';
import { createTask } from '../../services/tasks/TaskService';
import { updateTask } from '../../services/tasks/TaskService';
import type { Task, TaskPriority } from '../../types/Task';

const PRIORITIES: { key: TaskPriority; label: string; color: string }[] = [
  { key: 'low',    label: 'Low',    color: '#6B7280' },
  { key: 'normal', label: 'Normal', color: '#3B82F6' },
  { key: 'high',   label: 'High',   color: '#F59E0B' },
  { key: 'urgent', label: 'Urgent', color: '#EF4444' },
];

type Props = {
  visible: boolean;
  accentColor: string;
  onClose: () => void;
  // Modo crear
  listId?: string;
  onCreated?: (task: Task) => void;
  // Modo editar — si task no es null, el modal opera en modo edición
  task?: Task | null;
  onSaved?: (updated: Task) => void;
};

export default function TaskFormModal({
  visible, accentColor, onClose,
  listId, onCreated,
  task, onSaved,
}: Props) {
  const isEdit = task != null;
  const today = () => new Date().toISOString().split('T')[0];

  const [title, setTitle]             = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority]       = useState<TaskPriority>('normal');
  const [dueDate, setDueDate]         = useState(today());
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');

  // Cuando la tarea a editar cambia, precarga el formulario con sus datos
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description ?? '');
      setPriority(task.priority ?? 'normal');
      setDueDate(task.dueDate ? task.dueDate.split('T')[0] : today());
      setError('');
    }
  }, [task]);

  const reset = () => {
    setTitle(''); setDescription(''); setPriority('normal');
    setDueDate(today()); setError(''); setLoading(false);
  };

  const handleClose = () => { reset(); onClose(); };

  const handleSubmit = async () => {
    if (!title.trim()) { setError('El título es obligatorio'); return; }
    setLoading(true);
    setError('');
    try {
      if (isEdit && task) {
        const updated = await updateTask(task.id, {
          title: title.trim(),
          description: description.trim() || undefined,
          priority,
          dueDate: dueDate ? new Date(dueDate + 'T12:00:00').toISOString() : null,
        });
        setLoading(false);
        onSaved?.(updated);
      } else {
        const created = await createTask({
          title: title.trim(),
          description: description.trim() || undefined,
          listId,
          priority,
          dueDate: dueDate ? new Date(dueDate + 'T12:00:00').toISOString() : null,
        });
        setLoading(false);
        reset();
        onCreated?.(created);
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message ?? 'Error al guardar');
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div
      onClick={handleClose}
      style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ backgroundColor: '#fff', borderRadius: 20, width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #F3F4F6' }}>
          <button onClick={handleClose} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
            <MdClose size={22} color="#374151" />
          </button>
          <span style={{ fontSize: 17, fontWeight: 600, color: '#111827' }}>
            {isEdit ? 'Edit Task' : 'New Task'}
          </span>
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
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: 0.8, marginBottom: 8 }}>TASK TITLE *</label>
            <input
              type="text"
              value={title}
              onChange={e => { setTitle(e.target.value); setError(''); }}
              placeholder="e.g. Read chapter 5"
              style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: `1px solid ${error && !title.trim() ? '#EF4444' : '#E5E7EB'}`, backgroundColor: '#F9FAFB', fontSize: 15, boxSizing: 'border-box', color: '#111827', outline: 'none' }}
            />
          </div>

          {/* Descripción */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: 0.8, marginBottom: 8 }}>DESCRIPTION (OPTIONAL)</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add more details..."
              rows={3}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', fontSize: 15, boxSizing: 'border-box', resize: 'none', color: '#111827', fontFamily: 'inherit', outline: 'none' }}
            />
          </div>

          {/* Prioridad */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: 0.8, marginBottom: 10 }}>PRIORITY</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {PRIORITIES.map(p => (
                <button
                  key={p.key}
                  onClick={() => setPriority(p.key)}
                  style={{ padding: '8px 14px', borderRadius: 20, border: `1.5px solid ${priority === p.key ? p.color : '#E5E7EB'}`, backgroundColor: priority === p.key ? p.color : 'transparent', color: priority === p.key ? '#fff' : '#6B7280', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Fecha — <input type="date"> reemplaza al DatePickerField nativo */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: 0.8, marginBottom: 8 }}>DUE DATE</label>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', fontSize: 15, boxSizing: 'border-box', color: '#111827', outline: 'none' }}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '0 24px 24px' }}>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ width: '100%', padding: 16, backgroundColor: loading ? '#9CA3AF' : accentColor, color: '#fff', border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Guardando...' : isEdit ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </div>
    </div>
  );
}
