import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MdArrowBack, MdEdit, MdDeleteOutline,
  MdCheckCircle, MdRadioButtonUnchecked,
  MdEvent, MdList,
} from 'react-icons/md';
import { fetchTask, deleteTask, toggleTaskStatus } from '../../services/tasks/TaskService';
import type { Task, TaskStatus } from '../../types/Task';
import { ACCENT_COLORS } from '../../components/TaskListCard/TaskListCard';
import TaskFormModal from '../../components/TaskFormModal/TaskFormModal';
import DeleteConfirmModal from '../../components/DeleteConfirmModal/DeleteConfirmModal';

const PRIORITY_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  low:    { bg: '#F3F4F6', text: '#6B7280', label: 'Low' },
  normal: { bg: '#DBEAFE', text: '#1D4ED8', label: 'Normal' },
  high:   { bg: '#FEF3C7', text: '#B45309', label: 'High' },
  urgent: { bg: '#FEE2E2', text: '#DC2626', label: 'Urgent' },
};

function formatDate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('es-MX', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

export default function Tasks() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [task, setTask]           = useState<Task | null>(null);
  const [loading, setLoading]     = useState(true);
  const [toggling, setToggling]   = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [editOpen, setEditOpen]   = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting]   = useState(false);

  const loadTask = useCallback(async () => {
    if (!id) return;
    try {
      setError(null);
      const data = await fetchTask(id);
      setTask(data);
    } catch (err: unknown) {
      const e = err as { response?: { status?: number } };
      if (e.response?.status === 404) {
        setError('Tarea no encontrada.');
      } else {
        setError('Error al cargar la tarea.');
      }
    }
  }, [id]);

  useEffect(() => {
    setLoading(true);
    loadTask().finally(() => setLoading(false));
  }, [loadTask]);

  const accentHex = ACCENT_COLORS[task?.listAccentColor ?? ''] ?? ACCENT_COLORS.PRIMARY_BLUE;
  const priority  = PRIORITY_STYLES[task?.priority ?? 'normal'] ?? PRIORITY_STYLES.normal;
  const isDone    = task?.status === 'completed';

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleToggle = async () => {
    if (!task || toggling) return;
    const newStatus: TaskStatus = isDone ? 'pending' : 'completed';
    setToggling(true);
    // Actualización optimista
    setTask(prev => prev ? { ...prev, status: newStatus } : prev);
    try {
      const updated = await toggleTaskStatus(task.id, newStatus);
      setTask(updated);
    } catch {
      // Rollback
      setTask(prev => prev ? { ...prev, status: task.status } : prev);
    } finally {
      setToggling(false);
    }
  };

  const handleSaved = (updated: Task) => {
    setEditOpen(false);
    setTask(updated);
  };

  const handleDelete = async () => {
    if (!task) return;
    setDeleting(true);
    try {
      await deleteTask(task.id);
      // Si tiene lista padre, regresa a ella; si no, al home
      navigate(task.listId ? `/lists/${task.listId}` : '/', { replace: true });
    } catch {
      setDeleting(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ width: 36, height: 36, border: `3px solid ${ACCENT_COLORS.PRIMARY_BLUE}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  if (error || !task) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <p style={{ color: '#EF4444', fontSize: 15 }}>{error ?? 'Tarea no encontrada.'}</p>
        <button onClick={() => navigate(-1)} style={{ padding: '10px 20px', backgroundColor: '#3B82F6', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer' }}>
          Volver
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC' }}>

      {/* Header con color de acento de la lista padre */}
      <div style={{ backgroundColor: accentHex, padding: '20px 24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <button
            onClick={() => navigate(-1)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: '#fff', fontSize: 14, fontWeight: 600, padding: 0 }}
          >
            <MdArrowBack size={22} color="#fff" /> Volver
          </button>

          <div style={{ display: 'flex', gap: 4 }}>
            <button onClick={() => setEditOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, display: 'flex' }}>
              <MdEdit size={22} color="#fff" />
            </button>
            <button onClick={() => setDeleteOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, display: 'flex' }}>
              <MdDeleteOutline size={22} color="#fff" />
            </button>
          </div>
        </div>

        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11, fontWeight: 700, letterSpacing: 1, margin: '0 0 6px 0' }}>
          TASK DETAIL
        </p>
        <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 800, margin: 0, textDecoration: isDone ? 'line-through' : 'none', opacity: isDone ? 0.7 : 1 }}>
          {task.title}
        </h1>
      </div>

      {/* Contenido */}
      <div style={{ padding: '24px', maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Tarjeta de estado + toggle */}
        <div style={{ backgroundColor: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: 0.8, margin: '0 0 6px 0' }}>ESTADO</p>
            <p style={{ fontSize: 16, fontWeight: 700, color: isDone ? '#16A34A' : '#374151', margin: 0 }}>
              {isDone ? 'Completada' : 'Pendiente'}
            </p>
          </div>
          {/* Botón toggle grande — equivalente al checkbox del TaskRow */}
          <button
            onClick={handleToggle}
            disabled={toggling}
            style={{ background: 'none', border: 'none', cursor: toggling ? 'not-allowed' : 'pointer', display: 'flex', opacity: toggling ? 0.5 : 1 }}
          >
            {isDone
              ? <MdCheckCircle size={40} color="#16A34A" />
              : <MdRadioButtonUnchecked size={40} color="#D1D5DB" />
            }
          </button>
        </div>

        {/* Badges: prioridad + fecha */}
        <div style={{ backgroundColor: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: 0.8, margin: '0 0 8px 0' }}>PRIORIDAD</p>
            <span style={{ backgroundColor: priority.bg, color: priority.text, fontSize: 13, fontWeight: 700, padding: '5px 12px', borderRadius: 20 }}>
              {priority.label}
            </span>
          </div>

          {task.dueDate && (
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: 0.8, margin: '0 0 8px 0' }}>FECHA LÍMITE</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <MdEvent size={18} color="#6B7280" />
                <span style={{ fontSize: 14, color: '#374151', fontWeight: 500 }}>
                  {formatDate(task.dueDate)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Descripción */}
        {task.description && (
          <div style={{ backgroundColor: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: 0.8, margin: '0 0 10px 0' }}>DESCRIPCIÓN</p>
            <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7, margin: 0 }}>
              {task.description}
            </p>
          </div>
        )}

        {/* Link a la lista padre */}
        {task.listId && (
          <div style={{ backgroundColor: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: 0.8, margin: '0 0 10px 0' }}>LISTA</p>
            <Link
              to={`/lists/${task.listId}`}
              style={{ display: 'flex', alignItems: 'center', gap: 8, color: accentHex, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}
            >
              <MdList size={20} />
              {task.listTitle ?? 'Ver lista'}
            </Link>
          </div>
        )}
      </div>

      {/* Modal editar */}
      <TaskFormModal
        visible={editOpen}
        accentColor={accentHex}
        task={task}
        onSaved={handleSaved}
        onClose={() => setEditOpen(false)}
      />

      {/* Modal confirmar eliminación */}
      <DeleteConfirmModal
        visible={deleteOpen}
        title={task.title}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </div>
  );
}
