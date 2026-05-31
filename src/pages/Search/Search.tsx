import { useCallback, useRef, useState } from 'react';
import { MdSearch } from 'react-icons/md';
import { searchAll } from '../../services/search/searchService';
import type { SearchResult } from '../../services/search/searchService';
import { toggleTaskStatus } from '../../services/tasks/TaskService';
import type { Task, TaskStatus } from '../../types/Task';
import AppLayout from '../../components/AppLayout/AppLayout';
import TaskListCard, { ACCENT_COLORS } from '../../components/TaskListCard/TaskListCard';
import TaskRow from '../../components/TaskRow/TaskRow';

const DEBOUNCE_MS = 350;

export default function Search() {
  const [query, setQuery]     = useState('');
  const [result, setResult]   = useState<SearchResult | null>(null);
  const [tasks, setTasks]     = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  // useRef guarda el id del timer entre renders sin causar re-render
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResult(null);
      setTasks([]);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await searchAll(q);
      setResult(data);
      setTasks(data.tasks);
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message ?? 'Error al buscar');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setQuery(text);
    // Cancela el timer anterior y arranca uno nuevo — debounce manual
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(text), DEBOUNCE_MS);
  };

  const handleToggleComplete = async (task: Task) => {
    const newStatus: TaskStatus = task.status === 'completed' ? 'pending' : 'completed';

    // 1. Actualización optimista: la UI responde de inmediato sin esperar la API
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus } : t));

    try {
      await toggleTaskStatus(task.id, newStatus);
    } catch (err: unknown) {
      console.error('[Search] toggle error', err);
      // 2. Rollback: si la API falla, se revierte al estado original
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: task.status } : t));
    }
  };

  const listCount = result?.lists.length ?? 0;
  const taskCount = tasks.length;
  const hasQuery  = query.trim().length > 0;
  const hasResult = result !== null;

  return (
    <AppLayout>
      {/* Barra de búsqueda */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: '12px 14px',
        boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
        marginBottom: 24,
        gap: 8,
      }}>
        <MdSearch size={20} color="#9CA3AF" style={{ flexShrink: 0 }} />
        <input
          type="text"
          value={query}
          onChange={handleQueryChange}
          placeholder="Search tasks, lists, or notes..."
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: 15,
            color: '#111827',
            backgroundColor: 'transparent',
          }}
        />
        {/* Spinner inline mientras carga */}
        {loading && (
          <>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <div style={{ width: 18, height: 18, border: '2px solid #3B82F6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite', flexShrink: 0 }} />
          </>
        )}
      </div>

      {/* Estado vacío inicial — sin query todavía */}
      {!hasQuery && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 64, gap: 8 }}>
          <MdSearch size={44} color="#D1D5DB" />
          <p style={{ fontSize: 17, fontWeight: 700, color: '#374151', margin: 0 }}>Find anything</p>
          <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0 }}>Search your tasks, lists, and notes.</p>
        </div>
      )}

      {/* Sin resultados */}
      {hasQuery && !loading && hasResult && listCount === 0 && taskCount === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 64, gap: 8 }}>
          <MdSearch size={44} color="#D1D5DB" />
          <p style={{ fontSize: 17, fontWeight: 700, color: '#374151', margin: 0 }}>No results</p>
          <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0 }}>Nothing matched "{query}"</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ backgroundColor: '#FEE2E2', color: '#DC2626', padding: '12px 16px', borderRadius: 12, fontSize: 14 }}>
          {error}
        </div>
      )}

      {/* MATCHED LISTS */}
      {listCount > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: 1 }}>MATCHED LISTS</span>
            <span style={{ backgroundColor: '#EFF6FF', color: '#3B82F6', fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20 }}>
              {listCount} found
            </span>
          </div>
          {result!.lists.map(list => (
            <TaskListCard key={list.id} item={list} />
          ))}
        </div>
      )}

      {/* TASKS & EXERCISES */}
      {taskCount > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: 1 }}>TASKS & EXERCISES</span>
            <span style={{ backgroundColor: '#EFF6FF', color: '#3B82F6', fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20 }}>
              {taskCount} found
            </span>
          </div>
          {tasks.map(task => (
            <div key={task.id}>
              {/* Nombre de la lista al que pertenece la tarea */}
              {task.listTitle && (
                <p style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', margin: '0 0 3px 2px', letterSpacing: 0.3 }}>
                  {task.listTitle}
                </p>
              )}
              <TaskRow
                task={task}
                accentColor={ACCENT_COLORS[task.listAccentColor ?? ''] ?? ACCENT_COLORS.PRIMARY_BLUE}
                onToggleComplete={handleToggleComplete}
                onEditPress={() => {}}
                onDeletePress={() => {}}
                showActions={false}
              />
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
