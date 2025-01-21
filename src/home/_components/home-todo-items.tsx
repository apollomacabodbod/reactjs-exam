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

  // Handle edit operation
  const handleEdit = async (id: string, newTitle: string) => {
    try {
      const response = await fetch(`https://678f686f49875e5a1a91b684.mockapi.io/todo/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Title: newTitle,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to update todo');
      }
      const updatedTodo = await response.json();
      setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo))); // Update the todo in state
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  // Handle create operation
  const handleCreate = async () => {
    if (!newTitle) {
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
    <div>
      <h1>Todo List</h1>
      
      {/* Create Todo Form */}
      <div className='border border-[#50B498] green mt-[3em]'>
        <input
          type="text"
          placeholder="Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <button onClick={handleCreate}>Add Todo</button>
      </div>



      <ul className='mt-[3em]'>
        {incompleteTodos.map((todo) => (



          <li key={todo.id} className='flex flex-col border border-[#50B498] green'>



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
              <button onClick={() => handleEdit(todo.id, prompt('Enter new title:', todo.Title) || todo.Title)}>
              Edit
              </button>

              {/* Remove Button */}
              <button onClick={() => handleRemove(todo.id)}>Remove</button>


            </div>


          



          
          </li>
        ))}
      </ul>




      {/* Completed Todos */}
      <h2 className='mt-[2em] border border-[#50B498] green'>Finished ToDos</h2>


      <div className='mt-[1em] border border-[#50B498] green'>

        {completedTodos.map((todo) => (

          <div key={todo.id} className='flex flex-col '>


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
                <button onClick={() => handleEdit(todo.id, prompt('Enter new title:', todo.Title) || todo.Title)}>
              Edit
                </button>



                {/* Remove Button */}
                <button onClick={() => handleRemove(todo.id)}>Remove</button>



              </div>



            </div>





 



           

          



          </div>
        ))}
      </div>



    </div>
  );
};

export default TodoList;
