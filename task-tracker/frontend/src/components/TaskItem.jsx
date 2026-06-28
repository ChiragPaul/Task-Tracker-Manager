import React, { useState } from 'react';
import { Edit2, Trash2, Calendar, Clock, AlertCircle, CheckCircle2, Circle } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const CircularProgress = ({ createdAt, dueDate }) => {
  if (!dueDate || !createdAt) return null;
  
  const start = new Date(createdAt).getTime();
  const end = new Date(dueDate).getTime();
  const now = new Date().getTime();
  
  const total = end - start;
  const elapsed = now - start;
  let percentage = (elapsed / total) * 100;
  
  if (percentage < 0) percentage = 0;
  if (percentage > 100) percentage = 100;
  if (total <= 0) percentage = 100;

  const radius = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let color = 'var(--status-completed)'; // green if lots of time
  if (percentage > 70) color = 'var(--priority-medium)'; // orange if getting close
  if (percentage > 90) color = 'var(--danger)'; // red if urgent

  return (
    <div title={`Time elapsed: ${Math.round(percentage)}%`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="24" height="24" viewBox="0 0 24 24" style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx="12" cy="12" r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="3"
        />
        <circle
          cx="12" cy="12" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
    </div>
  );
};

const TaskItem = ({ task, onEdit, onDelete, onStatusUpdate }) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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

  const handleCompleteToggle = () => {
    if (task.status === 'Completed') {
      onStatusUpdate(task._id, { ...task, status: 'Pending' });
      return;
    }
    
    setIsCompleting(true);
    setTimeout(() => {
      onStatusUpdate(task._id, { ...task, status: 'Completed' });
      setIsCompleting(false);
    }, 600);
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`glass ${isCompleting ? 'task-completed-fade' : ''}`} 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        padding: '1.25rem', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '0.75rem', 
        position: 'relative',
        cursor: 'pointer',
        border: isHovered ? '1px solid var(--primary)' : '1px solid var(--glass-border)',
        transition: 'border 0.3s'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
          <button 
            onClick={(e) => { e.stopPropagation(); handleCompleteToggle(); }} 
            className="btn-icon" 
            style={{ padding: 0, background: 'transparent', color: task.status === 'Completed' || isCompleting ? 'var(--status-completed)' : 'rgba(255,255,255,0.5)' }}
          >
            {task.status === 'Completed' || isCompleting ? <CheckCircle2 size={24} /> : <Circle size={24} />}
          </button>
          
          <div className={`priority-dot ${task.priority === 'Low' ? 'dot-low' : task.priority === 'Medium' ? 'dot-medium' : 'dot-high'}`} title={`${task.priority} Priority`} />
          
          <h3 className={`strikethrough ${task.status === 'Completed' || isCompleting ? 'active' : ''}`} style={{ fontSize: '1.1rem', margin: 0, wordBreak: 'break-word', color: task.status === 'Completed' || isCompleting ? 'rgba(255,255,255,0.5)' : 'inherit' }}>
            {task.title}
          </h3>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {task.status !== 'Completed' && <CircularProgress createdAt={task.createdAt} dueDate={task.dueDate} />}
          
          <AnimatePresence>
            {isHovered && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.8 }}
                style={{ display: 'flex', gap: '0.25rem' }}
              >
                <button className="btn-icon" onClick={(e) => { e.stopPropagation(); onEdit(task); }} title="Edit Task" style={{ padding: '0.4rem' }}>
                  <Edit2 size={14} />
                </button>
                <button className="btn-icon" onClick={(e) => { e.stopPropagation(); onDelete(task._id); }} title="Delete Task" style={{ color: 'var(--danger)', padding: '0.4rem' }}>
                  <Trash2 size={14} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            {task.description && (
              <p style={{ color: task.status === 'Completed' || isCompleting ? 'rgba(255,255,255,0.3)' : 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem', whiteSpace: 'pre-wrap', transition: 'color 0.4s', margin: 0, paddingTop: '0.5rem' }}>
                {task.description}
              </p>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--glass-border)' }}>
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
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TaskItem;
