import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import '../styles/style.css'; // Make sure to include your CSS styles in a separate file

const ToDoApp = () => {
  const [lightMode, setLightMode] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [hideCompleted, setHideCompleted] = useState(false);
  const [userImage, setUserImage] = useState(null);
  const [userId, setUserId] = useState(''); // Assuming userId is stored in state after login
  const [error, setError] = useState('');

  useEffect(() => {
    if (lightMode) {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }

    // Retrieve user image and ID from local storage
    const image = localStorage.getItem('userImage');
    const id = localStorage.getItem('userId');
    setUserImage(image);
    setUserId(id);

    // Fetch tasks from server
    if (id) {
        console.log(`Fetching tasks for user ID: ${id}`); // Add this line for debugging
      fetchTasks(id);
    }
  }, [lightMode]);

  const fetchTasks = (id) => {
    const token = localStorage.getItem('token'); // Retrieve the token from local storage
    axios.get(`http://localhost:5036/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => setTasks(response.data))
    .catch(error => console.error('Error fetching tasks:', error));
  };

  const toggleLightMode = () => {
    setLightMode(!lightMode);
  };

  const toggleCompletion = (id) => {
    const token = localStorage.getItem('token'); // Retrieve the token from local storage
    axios.put(`http://localhost:5036/update/${id}`, { completed: !tasks.find(task => task._id === id).completed }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((response) => {
      const updatedTasks = tasks.map(task =>
        task._id === id ? response.data : task
      );
      setTasks(updatedTasks);
    })
    .catch((error) => {
      console.error('Error updating task:', error);
    });
  };

  const deleteTask = (id) => {
    const token = localStorage.getItem('token'); // Retrieve the token from local storage
    axios.delete(`http://localhost:5036/remove/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      const updatedTasks = tasks.filter(task => task._id !== id);
      setTasks(updatedTasks);
    })
    .catch((error) => {
      console.error('Error deleting task:', error);
    });
  };

  const addNewTask = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      const newTaskObj = { text: newTask.trim(), completed: false };
      const token = localStorage.getItem('token'); // Retrieve the token from local storage

      axios.post(`http://localhost:5036/addtask/${userId}`, newTaskObj, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((response) => {
        setTasks([...tasks, response.data]);
        setNewTask('');
      })
      .catch((error) => {
        console.error('Error adding new task:', error);
        setError('Failed to add task. Please try again.');
      });
    } else {
      setError('Task cannot be empty.');
    }
  };

  const toggleHideCompleted = () => {
    setHideCompleted(!hideCompleted);
  };

  return (
    <div className="container">
      <div className="header">
        <div className="header-title">
          <h1 className="text-3xl font-bold">TO DO APP</h1>
          <p>Stop Procrastinating, Start Organizing</p>
        </div>
        <div className="user-icon">
          <img
            src={lightMode ? 'Group2.png' : 'Group.png'}
            alt="Toggle Light Mode"
            onClick={toggleLightMode}
          />
          <img src={userImage || 'photo.png'} alt="Profile" className="ml-2 profile-image" />
        </div>
      </div>
      <hr className="hr-line" />
      <div className="tasks-container">
        <div className="hide-completed">
          <button
            onClick={toggleHideCompleted}
            className="hide-button bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center"
          >
            {hideCompleted ? (
              <>
                <FontAwesomeIcon icon={faEye} className="mr-2" />
                <span>Unhide Completed</span>
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faEyeSlash} className="mr-2" />
                <span>Hide Completed</span>
              </>
            )}
          </button>
        </div>

        <div className="completion-message text-gray-500">
          {tasks.filter((task) => task.completed).length} Completed
        </div>
        {tasks.map((task) =>
          (!hideCompleted || !task.completed) && (
            <div className="task-item flex items-center mb-4" key={task._id}>
              <div
                className={`task-icon w-8 h-8 border border-gray-800 rounded-full cursor-pointer ${task.completed ? 'completed' : ''}`}
                onClick={() => toggleCompletion(task._id)}
              >
              </div>
              <h5 className={`ml-4 flex-1 ${task.completed ? 'completed-text' : ''}`}>
                {task.text}
              </h5>
              <div className="trashcan-container">
                <FontAwesomeIcon
                  icon={faTrashAlt}
                  className="delete-icon text-gray-500 cursor-pointer"
                  onClick={() => deleteTask(task._id)}
                />
              </div>
            </div>
          )
        )}
      </div>
      <div className="add-note flex items-center mt-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New Note"
          className="w-full max-w-md h-10 px-2 rounded-lg bg-gray-800 text-white mr-2"
        />
        <input
          type="submit"
          value="Add New Note"
          onClick={addNewTask}
          className="w-40 h-10 px-4 rounded-lg bg-white text-gray-800 hover:bg-gray-300 cursor-pointer"
        />
      </div>
      {error && <div className="error-message text-red-500 mt-2">{error}</div>}
    </div>
  );
};

export default ToDoApp;
