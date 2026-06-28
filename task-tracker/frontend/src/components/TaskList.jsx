import React from 'react';
import TaskItem from './TaskItem';
import { Loader2 } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

const TaskList = ({ tasks, loading, onEdit, onDelete, onStatusUpdate }) => {
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px', width: '100%' }}>
        <Loader2 className="animate-spin" size={32} style={{ color: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
        <style>{`
          @keyframes spin { 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="glass" style={{ padding: '3rem', textAlign: 'center', gridColumn: '1 / -1' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No tasks found</h3>
        <p style={{ color: 'rgba(255,255,255,0.7)' }}>Get started by creating a new task!</p>
      </div>
    );
  }

  const columns = ['Pending', 'In Progress', 'Completed'];

  return (
    <div className="kanban-board">
      {columns.map(status => {
        const columnTasks = tasks.filter(t => t.status === status);
        
        return (
          <div key={status} className="kanban-column">
            <h3 className="kanban-column-title">
              {status}
              <span className="count">{columnTasks.length}</span>
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <AnimatePresence>
                {columnTasks.map(task => (
                  <TaskItem
                    key={task._id}
                    task={task}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onStatusUpdate={onStatusUpdate}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskList;
