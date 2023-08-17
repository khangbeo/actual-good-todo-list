import React from 'react';
import { useEffect, useState } from 'react';

const getUUID = () =>
  (String(1e7) + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      Number(c) ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))
    ).toString(16)
  );

// add priority to tasks - low, medium, high
// sort tasks by priority, alphabetical,

function Button({ children, onClick, bgColor = 'slate' }) {
  const buttonAnim = `hover:scale-x-95 hover:scale-y-95`;
  return (
    <button
      onClick={onClick}
      className={`mx-2 px-3 py-2 rounded-3xl bg-${bgColor}-400 text-white hover:bg-${bgColor}-500 ${buttonAnim} ease-in-out duration-200`}
    >
      {children}
    </button>
  );
}

function App() {
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      return JSON.parse(savedTodos);
    } else {
      return [];
    }
  });

  // states for edit
  const [isEditing, setIsEditing] = useState(false);
  const [currentTodo, setCurrentTodo] = useState({});

  const [error, setError] = useState('');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Create
  const addTodo = (e) => {
    e.preventDefault();
    if (todo !== '') {
      const newTodo = {
        id: getUUID(),
        text: todo,
        date: Date.now(),
      };
      setTodos([newTodo, ...todos]);
    }

    if (todo === '') {
      setError('Task cannot be empty!');
    } else {
      setError('');
    }
    setTodo('');
  };

  // edit flow works like this
  // when user click edit button, we setIsEditing to true so the app knows we're in edit mode
  // then we store the current todo item that was clicked into a new state variable
  // when user type a text in the edit form, we update the currentTodo state variable with updated info
  // when user submit the form, we call updateTodo function with currentTodo's id and state value
  // next, we map the todos array and return a new array where the currentTodo's id matches the current index's id
  // if it matches, then the new array will contain updated todo, if not, then nothing changes
  // then we set old todos array with the updated todos

  // Edit
  function handleEditClick(todo) {
    setIsEditing(true);
    setCurrentTodo({ ...todo });
  }

  function handleEditInputChange({ target }) {
    setCurrentTodo({ ...currentTodo, text: target.value });
  }

  function handleEditFormSubmit(e) {
    e.preventDefault();
    handleUpdateTodo(currentTodo.id, currentTodo);
  }

  function handleUpdateTodo(id, updatedTodo) {
    const updatedItem = todos.map((todo) =>
      todo.id === id ? updatedTodo : todo
    );
    setIsEditing(false);
    setTodos(updatedItem);
  }

  // Delete
  const removeTodo = (id) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setError('');
    setTodos(newTodos);
  };

  const handleFormChange = ({ target }) => {
    setTodo(target.value);
  };

  const handleClearAll = () => {
    setTodos([]);
    setError('')
    setTodo('');
  };

  // sorting
  const sortAtoZ = () => {
    const newTodos = [...todos].sort((a, b) => a.text.localeCompare(b.text));
    setTodos(newTodos);
  };

  const sortZtoA = () => {
    const newTodos = [...todos].sort((a, b) => b.text.localeCompare(a.text));
    setTodos(newTodos);
  };

  const sortByNewest = () => {
    const newTodos = [...todos].sort((a, b) => b.date - a.date);
    setTodos(newTodos);
  };

  const sortByOldest = () => {
    const newTodos = [...todos].sort((a, b) => a.date - b.date);
    setTodos(newTodos);
  };

  function getDateTime(timestamp) {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    const date = new Date(timestamp).toLocaleDateString('en-us', options);
    const time = new Date(timestamp).toLocaleTimeString('en-us');

    return (
      <>
        {date} - {time}
      </>
    );
  }

  const title =
    todos.length === 0 ? (
      <>
        You have <strong>no</strong> tasks. Add a task!
      </>
    ) : (
      <>
        You have <strong>{todos.length}</strong>{' '}
        {todos.length === 1 ? 'task' : 'tasks'}
      </>
    );

  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">To Do List</h1>

      <form
        className="w-full rounded-3xl border-4 border-slate-300 my-3"
        onSubmit={addTodo}
      >
        <input
          className="w-full rounded-3xl px-4 py-2 focus:outline-none"
          type="text"
          name="text"
          value={todo}
          onChange={handleFormChange}
          placeholder="Add todo"
        />
      </form>
      {error.length > 0 && <span className="text-red-500">{error}</span>}

      <div className="flex flex-col justify-center items-center w-full">
        <div className="my-3">
          <h3 className="text-xl">{title}</h3>
        </div>
        {todos.length > 1 && (
          <div className="my-3">
            <Button onClick={sortAtoZ}>Sort A to Z</Button>
            <Button onClick={sortZtoA}>Sort Z to A</Button>
            <Button onClick={sortByNewest}>Sort Newest</Button>
            <Button onClick={sortByOldest}>Sort Oldest</Button>
          </div>
        )}

        {todos.map((todo) => (
          <>
            <div
              className="flex my-1 p-3 w-full justify-between items-center bg-slate-200 rounded-xl hover:bg-slate-300 ease-in-out duration-200"
              key={todo.id}
            >
              {/* todo item */}

              <div className="text-lg">
                {isEditing && todo.id === currentTodo.id ? (
                  <p>
                    <form onSubmit={handleEditFormSubmit}>
                      <input
                        className="rounded-xl px-3 py-1"
                        name="editTodo"
                        type="text"
                        placeholder="Edit todo"
                        value={currentTodo.text}
                        onChange={handleEditInputChange}
                      />
                    </form>
                  </p>
                ) : (
                  <p>{todo.text}</p>
                )}
              </div>

              {/* buttons */}
              <div>
                {isEditing && todo.id === currentTodo.id ? (
                  <Button bgColor="blue" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                ) : (
                  <Button bgColor="blue" onClick={() => handleEditClick(todo)}>
                    Edit
                  </Button>
                )}

                <Button bgColor="red" onClick={() => removeTodo(todo.id)}>
                  Delete
                </Button>
              </div>
            </div>
            <div className="ml-auto">{getDateTime(todo.date)}</div>
          </>
        ))}
        <div className="my-4">
          {todos.length > 0 && (
            <Button bgColor="red" onClick={handleClearAll}>
              Clear All
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
