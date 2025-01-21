import React, { useEffect, useState } from 'react';

// Define the type for the fetched data based on the structure provided
interface Todo {
  id: string;
  Title: string;
  date_added: string;
  date_completed: string;
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);  // State to store fetched todos
  const [loading, setLoading] = useState<boolean>(true);  // Loading state
  const [error, setError] = useState<string | null>(null);  // Error state
  const [newTitle, setNewTitle] = useState<string>('');  // State to manage new todo title
  const [selectedTodoId, setSelectedTodoId] = useState<string | null>(null); // State to manage the selected radio button
  const [isModalOpen, setIsModalOpen] = useState(false); // State for controlling modal visibility
  const [todoToEdit, setTodoToEdit] = useState<Todo | null>(null); // State to hold the todo being edited

  useEffect(() => {
    // Fetch data from the API when the component mounts
    const fetchData = async () => {
      try {
        const response = await fetch('https://678f686f49875e5a1a91b684.mockapi.io/todo');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data: Todo[] = await response.json();
        setTodos(data);  // Update the state with the fetched data
        setLoading(false);  // Set loading to false
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
        setLoading(false);
      }
    };

    fetchData();  // Call the fetchData function
  }, []);  // Empty dependency array ensures this runs once when the component mounts

  // Handle remove operation
  const handleRemove = async (id: string) => {
    try {
      const response = await fetch(`https://678f686f49875e5a1a91b684.mockapi.io/todo/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }
      setTodos(todos.filter((todo) => todo.id !== id)); // Remove the todo from state
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  // Handle edit operation (when submitting the modal form)
  const handleEditSubmit = async () => {
    if (!todoToEdit || !todoToEdit.Title.trim()) return; // Ensure there's a valid todo and title

    try {
      const response = await fetch(`https://678f686f49875e5a1a91b684.mockapi.io/todo/${todoToEdit.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Title: todoToEdit.Title,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to update todo');
      }
      const updatedTodo = await response.json();
      setTodos(todos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))); // Update the todo in state
      setIsModalOpen(false); // Close the modal after edit
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  // Handle create operation
  const handleCreate = async () => {
    if (!newTitle.trim()) {
      setError('Title is required!');
      return;
    }

    // Get current date in YYYY-MM-DD format
    const currentDate = new Date().toISOString().split('T')[0];

    try {
      const response = await fetch('https://678f686f49875e5a1a91b684.mockapi.io/todo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Title: newTitle,
          date_added: currentDate,  // Automatically set current date
          date_completed: '', // Date completed will be updated later via radio button click
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to create todo');
      }
      const newTodo = await response.json();
      setTodos([...todos, newTodo]); // Add new todo to state
      setNewTitle('');  // Reset the input field
      setError(null);  // Clear error
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  // Handle radio button change
  const handleRadioChange = async (id: string) => {
    const todo = todos.find((todo) => todo.id === id);
    if (!todo || todo.date_completed) return; // If the todo is already completed, do nothing

    setSelectedTodoId(id);  // Set the selected todo's id
    const currentDate = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format

    try {
      const response = await fetch(`https://678f686f49875e5a1a91b684.mockapi.io/todo/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date_completed: currentDate, // Set date_completed when radio button is clicked
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to update date completed');
      }
      const updatedTodo = await response.json();
      setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo))); // Update the todo with the completed date
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  const openModal = (todo: Todo) => {
    setTodoToEdit(todo); // Set the todo to edit
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
    setTodoToEdit(null); // Reset the todo being edited
  };

  const handleOutsideClick = (e: React.MouseEvent) => {
    const modalContainer = e.target as HTMLElement;
    if (modalContainer.classList.contains('modal-overlay')) {
      closeModal();
    }
  };

  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal(); // Close modal on Escape key press
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown); // Cleanup on unmount
    };
  }, [isModalOpen]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Separate todos into completed and incomplete
  const incompleteTodos = todos.filter((todo) => !todo.date_completed);
  const completedTodos = todos.filter((todo) => todo.date_completed);

  return (
    <div >


     
      {/* Create Todo Form */}
      <div className=' mt-[3em]'>

        <h1 className=''>Todo List</h1>

        <form onSubmit={(e) => {
          e.preventDefault(); // Prevent the default form submission behavior
          handleCreate(); // Call the handleCreate function when the form is submitted
        
        }}

        className='flex flex-col mt-[1em]'
        
        >


          <div className='flex items-center'>

            <input
              type="text"
              placeholder="Todo text here"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
              className='outline-none border border-[gray] rounded-[0.25em] pl-[0.5em] font-roboto'
            />

          </div>


          <div className='flex items-center mt-[1em]'>


            <button type="submit" className=' py-[0.5em] px-[1em] rounded-[0.25em] bg-[orange] text-white'>Add todo</button> {/* The button type is "submit" now */}


          </div>
        


          
        </form>


      </div>

      {error && <div className="error-message">{error}</div>} {/* Error message display */}

      <ul className='mt-[3em]'>
        {incompleteTodos.map((todo) => (
          <li key={todo.id} className='flex flex-col '>
            <div className='flex items-center gap-[1em]'>
              {/* Conditionally render radio button */}
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="todoSelection"
                  checked={selectedTodoId === todo.id}
                  onChange={() => handleRadioChange(todo.id)}
                />
                <span>{todo.Title}</span>
              </label>

              {/* Edit Button */}
              <button onClick={() => openModal(todo)}>
                Edit
              </button>

              {/* Remove Button */}
              <button onClick={() => handleRemove(todo.id)}>Remove</button>
            </div>
          </li>
        ))}
      </ul>

      {/* Completed Todos */}
      <h2 className='mt-[2em] '>Finished ToDos</h2>
      <div className='mt-[1em] '>
        {completedTodos.map((todo) => (
          <div key={todo.id} className='flex flex-col'>
            <div className='flex items-center gap-[1em]'>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="green"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginLeft: '10px' }}
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
              <h2>{todo.Title}</h2>
              <div className='flex items-center gap-[1em]'>
                {/* Edit Button */}
                <button onClick={() => openModal(todo)}>
                  Edit
                </button>

                {/* Remove Button */}
                <button onClick={() => handleRemove(todo.id)}>Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for editing todo */}
      {isModalOpen && todoToEdit && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 modal-overlay"
          onClick={handleOutsideClick}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-full transition-transform transform">
            <h2 className="text-xl font-semibold mb-4 text-center">Edit Todo</h2>
            <input
              type="text"
              value={todoToEdit.Title}
              onChange={(e) => setTodoToEdit({ ...todoToEdit, Title: e.target.value })}
              className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-between mt-4">
              <button 
                onClick={handleEditSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg focus:outline-none hover:bg-blue-600 transition duration-200"
              >
                Save
              </button>
              <button 
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg focus:outline-none hover:bg-gray-600 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoList;
