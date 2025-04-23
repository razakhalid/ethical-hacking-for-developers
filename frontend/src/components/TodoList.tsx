import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Todo {
  id: number;
  title: string;
  description: string | null;
  privateNote: string | null;
  completed: boolean;
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [privateNote, setPrivateNote] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/todos');
      setTodos(response.data);
    } catch (err) {
      setError('Failed to fetch todos');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/todos', {
        title,
        description,
        privateNote,
      });
      setTitle('');
      setDescription('');
      setPrivateNote('');
      fetchTodos();
    } catch (err) {
      setError('Failed to create todo');
    }
  };

  const toggleComplete = async (id: number) => {
    try {
      const todo = todos.find(t => t.id === id);
      if (todo) {
        await axios.put(`http://localhost:3001/api/todos/${id}`, {
          ...todo,
          completed: !todo.completed,
        });
        fetchTodos();
      }
    } catch (err) {
      setError('Failed to update todo');
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3001/api/todos/${id}`);
      fetchTodos();
    } catch (err) {
      setError('Failed to delete todo');
    }
  };

  return (
    <div className="todo-list">
      <h2>My Todos</h2>
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit} className="todo-form">
        <div className="form-group">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            required
          />
        </div>
        <div className="form-group">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />
        </div>
        <div className="form-group">
          <textarea
            value={privateNote}
            onChange={(e) => setPrivateNote(e.target.value)}
            placeholder="Private Note"
          />
        </div>
        <button type="submit">Add Todo</button>
      </form>

      <div className="todos">
        {todos.map(todo => (
          <div key={todo.id} className={`todo ${todo.completed ? 'completed' : ''}`}>
            <div className="todo-content">
              <h3>{todo.title}</h3>
              {todo.description && <p>{todo.description}</p>}
              {todo.privateNote && <p className="private-note">{todo.privateNote}</p>}
            </div>
            <div className="todo-actions">
              <button onClick={() => toggleComplete(todo.id)}>
                {todo.completed ? 'Mark Incomplete' : 'Mark Complete'}
              </button>
              <button onClick={() => deleteTodo(todo.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoList; 