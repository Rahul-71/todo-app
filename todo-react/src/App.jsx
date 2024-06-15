import { useEffect, useState } from "react";
import { FaCheck, FaRegEdit } from "react-icons/fa";
import Modal from "./Modal";

import { RiDeleteBin5Fill } from "react-icons/ri";
import "./App.css";

function App() {
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [allTodos, setAllTodos] = useState([]);

  const [todoIdUpdate, setTodoIdUpdate] = useState(0);

  const handleOpenModal = (id) => {
    console.log("id selected to open modal : " + id);
    setTodoIdUpdate(id);
    console.log("opened the modal....");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    // Fetch todos from the server and update the state with the fetched todos
    const fetchTodos = async () => {
      try {
        const response = await fetch("http://localhost:8080/app/todos");

        // Check if the response is successful
        if (!response.ok) {
          throw new Error("Failed to fetch todos");
        }

        // Parse the response body as JSON
        const todos = await response.json();

        // Update the state with the fetched todos
        setAllTodos(todos);
      } catch (error) {
        console.error("Error fetching todos: ", error);
      }
    };

    fetchTodos();
  }, []);

  const handleAddTodo = async () => {
    const postURL = "http://localhost:8080/app/todo";
    if (!newTitle || !newDesc) {
      return;
    }

    const newTodo = {
      title: newTitle,
      description: newDesc,
      completionStatus: false,
    };

    try {
      const response = await fetch(postURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodo),
      });

      if (!response.ok) {
        throw new Error("Failed to add todo");
      }

      const data = await response.json();
      setAllTodos((prevTodos) => [...prevTodos, data]);
      setNewTitle("");
      setNewDesc("");
    } catch (error) {
      console.error("Failed to add todo:", error);
    }
  };

  const handleDeleteTodo = async (id) => {
    const deleteURL = `http://localhost:8080/app/todos/${id}`;

    try {
      const response = await fetch(deleteURL, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }

      setAllTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  const handleTodoCompletion = async (id) => {
    const updateURL = `http://localhost:8080/app/todos/${id}`;

    try {
      const response = await fetch(updateURL, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completionStatus: true }),
      });

      if (!response.ok) {
        throw new Error("Failed to update todo");
      }

      const data = await response.json();
      setAllTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === id ? data : todo))
      );
    } catch (error) {
      console.error("Failed to update todo:", error);
    }
  };

  const handleTodoUpdate = async ({ title, description }) => {
    console.log("id: " + todoIdUpdate);
    console.log("title : " + title);
    console.log("desc : " + description);

    const updateURL = `http://localhost:8080/app/todos/${todoIdUpdate}`;

    const updateTodo = {
      title: title,
      description: description,
    };

    try {
      const response = await fetch(updateURL, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateTodo),
      });

      if (!response.ok) {
        throw new Error("Failed to update todo");
      }

      const data = await response.json();
      setAllTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === todoIdUpdate ? data : todo))
      );
    } catch (error) {
      console.error("Failed to update todo:", error);
    } finally {
      setTodoIdUpdate(0);
    }
  };

  return (
    <div className="App">
      <h1>My ToDo</h1>

      <div className="todo-wrapper">
        {/* todo user input area */}
        <div className="todo-input">
          <div className="todo-input-item">
            <label>Title</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="What's the title?"
            />
          </div>
          <div className="todo-input-item">
            <label>Description</label>
            <input
              type="text"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Add any description..."
            />
          </div>
          <div className="todo-input-item">
            <button
              type="button"
              onClick={handleAddTodo}
              className="primary-btn"
            >
              ADD
            </button>
          </div>
        </div>

        {/* button area TOOD & COMPLETED */}
        <div className="btn-area">
          <button
            type="button"
            className={`secondary-btn ${
              isCompleteScreen === false && "active"
            }`}
            onClick={() => setIsCompleteScreen(false)}
          >
            Todo
          </button>
          <button
            type="button"
            className={`secondary-btn ${isCompleteScreen === true && "active"}`}
            onClick={() => setIsCompleteScreen(true)}
          >
            Completed
          </button>
        </div>

        {/* Todo item list */}
        <div className="todo-list">
          {allTodos
            .filter((todo) =>
              isCompleteScreen ? todo.completionStatus : !todo.completionStatus
            )
            .map((todo) => (
              <div
                className={`todo-list-item ${
                  isCompleteScreen ? "completed-item" : ""
                }`}
                key={todo.id}
              >
                <div>
                  <h3>{todo.title}</h3>
                  <p>{todo.description}</p>
                </div>

                <div>
                  <RiDeleteBin5Fill
                    className="icon"
                    onClick={() => {
                      handleDeleteTodo(todo.id);
                    }}
                  />

                  {!isCompleteScreen && (
                    <>
                      <FaCheck
                        className="check-icon"
                        onClick={() => {
                          handleTodoCompletion(todo.id);
                        }}
                      />
                      <FaRegEdit
                        className="edit-icon"
                        onClick={() => {
                          handleOpenModal(todo.id);
                        }}
                      />
                    </>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleTodoUpdate}
        />
      )}
    </div>
  );
}

export default App;
