import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MdArrowBack, MdEdit, MdDeleteOutline, MdAdd, MdCheckCircleOutline } from 'react-icons/md';
import { fetchListDetail, deleteList } from '../../services/lists/listService';
import { deleteTask, toggleTaskStatus } from '../../services/tasks/TaskService';
import type { ListDetail, Task, TaskStatus } from '../../types/Task';
import { ACCENT_COLORS } from '../../components/TaskListCard/TaskListCard';
import TaskRow from '../../components/TaskRow/TaskRow';
import TaskFormModal from '../../components/TaskFormModal/TaskFormModal';
import EditListModal from '../../components/EditListModal/EditListModal';
import DeleteConfirmModal from '../../components/DeleteConfirmModal/DeleteConfirmModal';

export default function Lists() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [list, setList]       = useState<ListDetail | null>(null);
  const [tasks, setTasks]     = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  // Modales de tarea
  const [addOpen, setAddOpen]           = useState(false);
  const [taskToEdit, setTaskToEdit]     = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [deleting, setDeleting]         = useState(false);

  // Modales de lista
  const [editListOpen, setEditListOpen]     = useState(false);
  const [deleteListOpen, setDeleteListOpen] = useState(false);
  const [deletingList, setDeletingList]     = useState(false);

  const loadDetail = useCallback(async () => {
    if (!id) return;
    try {
      setError(null);
      const data = await fetchListDetail(id);
      setList(data);
      setTasks(data.tasks ?? []);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string }; status?: number } };
      setError(e.response?.data?.message ?? 'Error al cargar la lista');
    }
  }, [id]);

  useEffect(() => {
    setLoading(true);
    loadDetail().finally(() => setLoading(false));
  }, [loadDetail]);

  // Progreso calculado localmente — igual que el móvil
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const totalCount     = tasks.length;
  const percentage     = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);
  const pendingTasks   = tasks.filter(t => t.status !== 'completed');

  const accentHex = ACCENT_COLORS[list?.accentColor ?? ''] ?? ACCENT_COLORS.PRIMARY_BLUE;

  // ── Handlers de tarea ──────────────────────────────────────────────────────

  const handleToggle = async (task: Task) => {
    const newStatus: TaskStatus = task.status === 'completed' ? 'pending' : 'completed';
    // Actualización optimista
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
    try {
      await toggleTaskStatus(task.id, newStatus);
    } catch {
      // Rollback si la API falla
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: task.status } : t));
    }
  };

  const handleTaskCreated = (newTask: Task) => {
    setAddOpen(false);
    setTasks(prev => [newTask, ...prev]);
  };

  const handleTaskSaved = (updated: Task) => {
    setTaskToEdit(null);
    setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    setDeleting(true);
    try {
      await deleteTask(taskToDelete.id);
      setTasks(prev => prev.filter(t => t.id !== taskToDelete.id));
      setTaskToDelete(null);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message ?? 'Error al eliminar');
    } finally {
      setDeleting(false);
    }
  };

  // ── Handlers de lista ──────────────────────────────────────────────────────

  const handleListSaved = (updated: ListDetail) => {
    setEditListOpen(false);
    // Preserva las tareas ya cargadas — el PUT no las devuelve
    setList(prev => prev ? { ...updated, tasks: prev.tasks } : updated);
  };

  const handleDeleteList = async () => {
    if (!id) return;
    setDeletingList(true);
    try {
      await deleteList(id);
      navigate('/', { replace: true });
    } catch {
      setDeletingList(false);
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

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC' }}>

      {/* Banner con color de acento — reemplaza el headerStyle del Stack nativo */}
      <div style={{ backgroundColor: accentHex, padding: '20px 24px 28px' }}>
        {/* Barra de navegación superior */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <button
            onClick={() => navigate(-1)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: '#fff', fontSize: 14, fontWeight: 600, padding: 0 }}
          >
            <MdArrowBack size={22} color="#fff" /> Volver
          </button>

          {/* Botones editar / eliminar lista */}
          <div style={{ display: 'flex', gap: 4 }}>
            <button
              onClick={() => setEditListOpen(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, display: 'flex' }}
            >
              <MdEdit size={22} color="#fff" />
            </button>
            <button
              onClick={() => setDeleteListOpen(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, display: 'flex' }}
            >
              <MdDeleteOutline size={22} color="#fff" />
            </button>
          </div>
        </div>

        {/* Info de la lista */}
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11, fontWeight: 700, letterSpacing: 1, margin: '0 0 6px 0' }}>
          COURSE MODULE
        </p>
        <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 800, margin: '0 0 4px 0' }}>
          {list?.title}
        </h1>
        {list?.description && (
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, margin: '0 0 14px 0', lineHeight: 1.5 }}>
            {list.description}
          </p>
        )}

        {/* Barra de progreso */}
        <div style={{ height: 6, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 3, overflow: 'hidden', marginBottom: 6 }}>
          <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: '#fff', borderRadius: 3, transition: 'width 0.3s ease' }} />
        </div>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, margin: 0 }}>{percentage}% completed</p>
      </div>

      {/* Contenido */}
      <div style={{ padding: '20px 24px 120px' }}>
        {/* Header de sección */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: 1 }}>ONGOING TASKS</span>
          <span style={{ backgroundColor: '#E5E7EB', color: '#374151', fontSize: 12, fontWeight: 500, padding: '3px 10px', borderRadius: 20 }}>
            {pendingTasks.length} Items Remaining
          </span>
        </div>

        {/* Error */}
        {error && (
          <p style={{ color: '#EF4444', fontSize: 13, marginBottom: 12 }}>{error}</p>
        )}

        {/* Lista vacía */}
        {!loading && pendingTasks.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 48, gap: 12 }}>
            <MdCheckCircleOutline size={48} color="#D1D5DB" />
            <p style={{ color: '#9CA3AF', fontSize: 14, textAlign: 'center', lineHeight: 1.6, margin: 0 }}>
              ¡Todo listo! Agrega una tarea con el botón +
            </p>
          </div>
        )}

        {/* Tareas pendientes */}
        {pendingTasks.map(task => (
          <TaskRow
            key={task.id}
            task={task}
            accentColor={accentHex}
            onToggleComplete={handleToggle}
            onEditPress={t => setTaskToEdit(t)}
            onDeletePress={t => setTaskToDelete(t)}
          />
        ))}
      </div>

      {/* FAB — botón flotante para agregar tarea */}
      <button
        onClick={() => setAddOpen(true)}
        style={{
          position: 'fixed', bottom: 28, right: 28,
          width: 56, height: 56, borderRadius: '50%',
          backgroundColor: accentHex, border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 4px 16px ${accentHex}66`,
        }}
      >
        <MdAdd size={28} color="#fff" />
      </button>

      {/* Modal: agregar tarea */}
      <TaskFormModal
        visible={addOpen}
        accentColor={accentHex}
        listId={id}
        onCreated={handleTaskCreated}
        onClose={() => setAddOpen(false)}
      />

      {/* Modal: editar tarea */}
      <TaskFormModal
        visible={taskToEdit !== null}
        accentColor={accentHex}
        task={taskToEdit}
        onSaved={handleTaskSaved}
        onClose={() => setTaskToEdit(null)}
      />

      {/* Modal: confirmar eliminar tarea */}
      <DeleteConfirmModal
        visible={taskToDelete !== null}
        title={taskToDelete?.title ?? ''}
        loading={deleting}
        onConfirm={handleDeleteTask}
        onCancel={() => setTaskToDelete(null)}
      />

      {/* Modal: editar lista */}
      <EditListModal
        visible={editListOpen}
        list={list}
        onSaved={handleListSaved}
        onClose={() => setEditListOpen(false)}
      />

      {/* Modal: confirmar eliminar lista */}
      <DeleteConfirmModal
        visible={deleteListOpen}
        title={list?.title ?? 'esta lista'}
        loading={deletingList}
        onConfirm={handleDeleteList}
        onCancel={() => setDeleteListOpen(false)}
      />
    </div>
  );
}
