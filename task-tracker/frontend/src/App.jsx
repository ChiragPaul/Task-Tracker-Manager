import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Filter } from 'lucide-react';
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
        <button className="btn btn-primary" onClick={() => handleOpenForm()}>
          <Plus size={20} /> New Task
        </button>
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
