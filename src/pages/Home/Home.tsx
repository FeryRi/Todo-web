import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdAdd } from 'react-icons/md';
import { fetchDashboard } from '../../services/lists/listService';
import type { TaskList, DueTask } from '../../types/TaskList';
import AppLayout from '../../components/AppLayout/AppLayout';
import TaskListCard from '../../components/TaskListCard/TaskListCard';
import CreateListModal from '../../components/CreateListModal/CreateListModal';

// Formatea la hora de vencimiento igual que el móvil
function formatDueTime(isoDate: string): string {
  return new Date(isoDate).toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

// Sub-componente: fila de tarea "Due Today"
function DueTaskRow({ task }: { task: DueTask }) {
  const navigate = useNavigate();
  const bulletColor = task.priority === 'urgent' ? '#EF4444' : '#3B82F6';

  return (
    <div
      onClick={() => task.listId && navigate(`/lists/${task.listId}`)}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '14px 16px',
        borderBottom: '1px solid #F3F4F6',
        cursor: task.listId ? 'pointer' : 'default',
      }}
    >
      <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: bulletColor, marginRight: 12, flexShrink: 0 }} />
      <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {task.title}
      </span>
      <span style={{ fontSize: 13, fontWeight: 600, color: '#EF4444', marginLeft: 8, flexShrink: 0 }}>
        {formatDueTime(task.dueDate)}
      </span>
    </div>
  );
}

// Spinner de carga en CSS puro
function Spinner() {
  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ width: 36, height: 36, border: '3px solid #3B82F6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </>
  );
}

export default function Home() {
  const [lists, setLists] = useState<TaskList[]>([]);
  const [dueTasks, setDueTasks] = useState<DueTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMsg, setLoadingMsg] = useState('Cargando...');
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const MAX_RETRIES = 3;

  // Misma lógica de reintentos que el móvil
  const loadDashboard = useCallback(async (attempt: number = 1): Promise<void> => {
    setError(null);

    const warmupTimer = setTimeout(
      () => setLoadingMsg(`Despertando el servidor… (intento ${attempt}/${MAX_RETRIES})`),
      5000
    );

    try {
      const data = await fetchDashboard();
      clearTimeout(warmupTimer);
      setLoadingMsg('Cargando...');
      setLists(data.lists);
      setDueTasks(data.tasksDueToday);
    } catch (err: unknown) {
      clearTimeout(warmupTimer);
      const e = err as { response?: { status?: number } };
      const status = e.response?.status;

      if (!e.response && attempt < MAX_RETRIES) {
        setLoadingMsg(`Sin respuesta. Reintentando… (${attempt}/${MAX_RETRIES})`);
        await new Promise(r => setTimeout(r, 8000));
        return loadDashboard(attempt + 1);
      }

      if (status === 401) {
        setError('Sesión inválida. Cierra sesión y vuelve a entrar.');
      } else if (!e.response) {
        setError(`Sin respuesta del servidor después de ${MAX_RETRIES} intentos.`);
      } else {
        setError(`Error ${status}: no se pudo cargar el dashboard.`);
      }
    }
  }, []);

  // Carga al montar — en móvil era useFocusEffect
  useEffect(() => {
    setLoading(true);
    loadDashboard().finally(() => setLoading(false));
  }, [loadDashboard]);

  const handleListCreated = (newList: TaskList) => {
    // Agrega al inicio del estado local sin recargar todo
    setLists(prev => [newList, ...prev]);
    setShowCreateModal(false);
  };

  const incompleteLists = lists.filter(l => l.percentage < 100);

  return (
    <AppLayout>
      {/* Greeting */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111827', margin: 0 }}>Your Atelier</h1>
        <p style={{ fontSize: 14, color: '#9CA3AF', marginTop: 4 }}>Focus on what matters today.</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 80, gap: 16 }}>
          <Spinner />
          <p style={{ color: '#9CA3AF', fontSize: 13, textAlign: 'center' }}>{loadingMsg}</p>
        </div>
      ) : error ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 60, gap: 12 }}>
          <p style={{ color: '#EF4444', fontSize: 15, textAlign: 'center', maxWidth: 400 }}>{error}</p>
          <button
            onClick={() => { setLoading(true); loadDashboard().finally(() => setLoading(false)); }}
            style={{ padding: '10px 20px', backgroundColor: '#3B82F6', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontSize: 14 }}
          >
            Reintentar
          </button>
        </div>
      ) : (
        <>
          {/* DUE TODAY — solo si hay tareas */}
          {dueTasks.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: 1, marginBottom: 8 }}>DUE TODAY</p>
              <div style={{ backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                {dueTasks.map(t => <DueTaskRow key={t.id} task={t} />)}
              </div>
            </div>
          )}

          {/* Header de listas + botón nueva lista */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: 1, margin: 0 }}>TUS LISTAS</p>
            <button
              onClick={() => setShowCreateModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', backgroundColor: '#3B82F6', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            >
              <MdAdd size={18} /> Nueva lista
            </button>
          </div>

          {/* Cards de listas */}
          {incompleteLists.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: 48, color: '#9CA3AF', fontSize: 15, lineHeight: 1.8 }}>
              <p style={{ margin: 0 }}>Aún no tienes listas.</p>
              <p style={{ margin: 0 }}>Crea una con el botón "Nueva lista".</p>
            </div>
          ) : (
            incompleteLists.map(list => <TaskListCard key={list.id} item={list} />)
          )}
        </>
      )}

      <CreateListModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={handleListCreated}
      />
    </AppLayout>
  );
}
