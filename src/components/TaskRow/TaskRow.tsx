import { useState } from 'react';
import { MdCheck, MdEdit, MdDeleteOutline, MdEvent } from 'react-icons/md';
import type { Task } from '../../types/Task';

const PRIORITY_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  low:    { bg: '#F3F4F6', text: '#6B7280', label: 'Low' },
  normal: { bg: '#DBEAFE', text: '#1D4ED8', label: 'Normal' },
  high:   { bg: '#FEF3C7', text: '#B45309', label: 'High' },
  urgent: { bg: '#FEE2E2', text: '#DC2626', label: 'Urgent' },
};

function formatDue(iso: string | null | undefined): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('es-MX', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

type Props = {
  task: Task;
  accentColor: string;
  onToggleComplete: (task: Task) => Promise<void>;
  onEditPress: (task: Task) => void;
  onDeletePress: (task: Task) => void;
  showActions?: boolean;
};

export default function TaskRow({
  task,
  accentColor,
  onToggleComplete,
  onEditPress,
  onDeletePress,
  showActions = true,
}: Props) {
  const [toggling, setToggling] = useState(false);

  const isDone   = task.status === 'completed';
  const priority = PRIORITY_STYLES[task.priority] ?? PRIORITY_STYLES.normal;
  const dueLabel = formatDue(task.dueDate);

  const handleToggle = async () => {
    if (toggling) return;
    setToggling(true);
    try {
      await onToggleComplete(task);
    } finally {
      setToggling(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      backgroundColor: '#fff',
      borderRadius: 14,
      marginBottom: 10,
      padding: 14,
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    }}>
      {/* Checkbox */}
      <button
        onClick={handleToggle}
        disabled={toggling}
        style={{
          width: 22,
          height: 22,
          borderRadius: 6,
          border: isDone ? 'none' : '2px solid #D1D5DB',
          backgroundColor: isDone ? accentColor : '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: toggling ? 'not-allowed' : 'pointer',
          flexShrink: 0,
          marginRight: 12,
          marginTop: 2,
          opacity: toggling ? 0.6 : 1,
          transition: 'background 0.15s',
        }}
      >
        {isDone && <MdCheck size={13} color="#fff" />}
      </button>

      {/* Contenido */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14,
          fontWeight: 600,
          color: isDone ? '#9CA3AF' : '#111827',
          textDecoration: isDone ? 'line-through' : 'none',
          marginBottom: 2,
        }}>
          {task.title}
        </div>

        {task.description && (
          <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 8, lineHeight: 1.5 }}>
            {task.description}
          </div>
        )}

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
          <span style={{ backgroundColor: priority.bg, color: priority.text, fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20 }}>
            {priority.label}
          </span>
          {dueLabel && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: '#9CA3AF' }}>
              <MdEvent size={11} color="#9CA3AF" />
              {dueLabel}
            </span>
          )}
        </div>
      </div>

      {/* Acciones edit / delete */}
      {showActions && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginLeft: 8 }}>
          <button
            onClick={() => onEditPress(task)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex' }}
          >
            <MdEdit size={18} color="#9CA3AF" />
          </button>
          <button
            onClick={() => onDeletePress(task)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex' }}
          >
            <MdDeleteOutline size={18} color="#EF4444" />
          </button>
        </div>
      )}
    </div>
  );
}
