import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, Filter, Bell, AlertCircle, Clock } from 'lucide-react';
import { fetchTasks, createTask, updateTask, deleteTask } from './api/api';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import Notification from './components/Notification';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute notifications dynamically
  const notifications = tasks.reduce((acc, task) => {
    if (task.status === 'Completed' || !task.dueDate) return acc;
    const now = new Date();
    const dueDate = new Date(task.dueDate);
    const diffTime = dueDate - now;
    
    if (diffTime < 0) {
      acc.push({ id: task._id, title: task.title, type: 'overdue', message: 'Overdue!' });
    } else if (diffTime < 24 * 60 * 60 * 1000) {
      acc.push({ id: task._id, title: task.title, type: 'soon', message: 'Due Soon' });
    }
    return acc;
  }, []);
  
  const [filters, setFilters] = useState({
    status: 'All',
    priority: 'All',
    sortBy: 'createdAt',
  });

  const [notification, setNotification] = useState({ message: '', type: '' });

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchTasks(filters);
      if (!Array.isArray(data)) {
        throw new Error('Invalid API response');
      }
      setTasks(data);
    } catch (error) {
      console.error(error);
      setTasks([]);
      showNotification('Failed to load tasks - Please check backend URL', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenForm = (task = null) => {
    setCurrentTask(task);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setCurrentTask(null);
  };

  const handleFormSubmit = async (taskData) => {
    try {
      if (currentTask) {
        await updateTask(currentTask._id, taskData);
        showNotification('Task updated successfully');
      } else {
        await createTask(taskData);
        showNotification('Task created successfully');
      }
      handleCloseForm();
      loadTasks();
    } catch (error) {
      showNotification(error.response?.data?.message || 'Something went wrong', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await deleteTask(id);
      showNotification('Task deleted successfully');
      loadTasks();
    } catch (error) {
      showNotification('Failed to delete task', 'error');
    }
  };

  const handleStatusUpdate = async (id, taskData) => {
    try {
      await updateTask(id, taskData);
      loadTasks();
    } catch (error) {
      showNotification('Failed to update task status', 'error');
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Task Tracker</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          
          {/* Notification Bell */}
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button className="btn-icon" onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} style={{ position: 'relative' }}>
              <Bell size={20} />
              {notifications.length > 0 && (
                <span className="notification-badge">
                  {notifications.length}
                </span>
              )}
            </button>
            
            {/* Dropdown Menu */}
            {isNotificationsOpen && (
              <div className="notification-dropdown glass">
                <h4 style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)', margin: 0 }}>Notifications</h4>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                      No active alerts
                    </div>
                  ) : (
                    notifications.map(notif => (
                      <div key={notif.id} className="notification-item">
                        {notif.type === 'overdue' ? <AlertCircle size={16} color="var(--danger)" /> : <Clock size={16} color="var(--priority-medium)" />}
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{notif.title}</span>
                          <span style={{ fontSize: '0.75rem', color: notif.type === 'overdue' ? 'var(--danger)' : 'var(--priority-medium)' }}>
                            {notif.message}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <button className="btn btn-primary" onClick={() => handleOpenForm()}>
            <Plus size={20} /> New Task
          </button>
        </div>
      </header>

      <div className="controls-bar glass" style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Filter size={18} style={{ color: 'rgba(255,255,255,0.5)', marginRight: '0.5rem' }} />
          
          <select name="status" className="filter-select" value={filters.status} onChange={handleFilterChange}>
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <select name="priority" className="filter-select" value={filters.priority} onChange={handleFilterChange}>
            <option value="All">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <select name="sortBy" className="filter-select" style={{ marginLeft: 'auto' }} value={filters.sortBy} onChange={handleFilterChange}>
            <option value="createdAt">Newest First</option>
            <option value="priority">Priority</option>
            <option value="dueDate">Due Date</option>
          </select>
        </div>
      </div>

      <main>
        <TaskList
          tasks={tasks}
          loading={loading}
          onEdit={handleOpenForm}
          onDelete={handleDelete}
          onStatusUpdate={handleStatusUpdate}
        />
      </main>

      {isFormOpen && (
        <TaskForm
          initialData={currentTask}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseForm}
        />
      )}

      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: '', type: '' })}
      />
    </div>
  );
}

export default App;
