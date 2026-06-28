import React from 'react';
import { Edit2, Trash2, Calendar, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const TaskItem = ({ task, onEdit, onDelete }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending': return 'status-pending';
      case 'In Progress': return 'status-progress';
      case 'Completed': return 'status-completed';
      default: return 'status-pending';
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'Low': return 'priority-low';
      case 'Medium': return 'priority-medium';
      case 'High': return 'priority-high';
      default: return 'priority-medium';
    }
  };

  return (
    <div className="glass animate-slide-in" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', wordBreak: 'break-word' }}>{task.title}</h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-icon" onClick={() => onEdit(task)} title="Edit Task">
            <Edit2 size={16} />
          </button>
          <button className="btn-icon" onClick={() => onDelete(task._id)} title="Delete Task" style={{ color: 'var(--danger)' }}>
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {task.description && (
        <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9375rem', flexGrow: 1, whiteSpace: 'pre-wrap' }}>
          {task.description}
        </p>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
        <span className={`badge ${getStatusClass(task.status)}`} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Clock size={12} /> {task.status}
        </span>
        <span className={`badge ${getPriorityClass(task.priority)}`} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <AlertCircle size={12} /> {task.priority} Priority
        </span>
        {task.dueDate && (
          <span className="badge" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(255,255,255,0.1)' }}>
            <Calendar size={12} /> {format(new Date(task.dueDate), 'MMM dd, yyyy')}
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskItem;
