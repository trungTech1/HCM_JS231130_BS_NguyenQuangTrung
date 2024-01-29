import React, { useState, useEffect, useRef } from "react";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import "./todolist.scss";
const TodoList = () => {
  const [todo, setTodo] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [deleteMode, setDeleteMode] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [nameError, setNameError] = useState("");
  const [completedTasks, setCompletedTasks] = useState(0);
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current.focus();
    localStorage.setItem("todo", JSON.stringify(todo));
    const completed = todo.filter((task) => task.status).length;
    setCompletedTasks(completed);
  }, [todo]);

  const addTask = () => {
    if (taskName.trim() !== "") {
      const newTask = {
        id: Date.now(),
        name: taskName,
        status: false,
      };
      setTodo([...todo, newTask]);
      setTaskName("");
      inputRef.current.focus();
    }
  };

  function handleStatusChange(id) {
    setTodo(
      todo.map((item) =>
        item.id === id ? { ...item, status: !item.status } : item
      )
    );
  }

  function handleEdit(task) {
    setEditMode(true);
    setCurrentTask(task);
  }

  function handleNameChange(e) {
    setCurrentTask({ ...currentTask, name: e.target.value });
  }

  function handleCancel() {
    setEditMode(false);
    setCurrentTask(null);
  }

  function handleUpdate(e) {
    e.preventDefault();
    if (currentTask.name.trim() === "") {
      setNameError("Dữ liệu không được để trống");
      return;
    }
    setTodo(
      todo.map((item) => (item.id === currentTask.id ? currentTask : item))
    );
    setEditMode(false);
    setCurrentTask(null);
    setNameError("");
  }

  function handleDeleteRequest(task) {
    setDeleteMode(true);
    setTaskToDelete(task);
  }

  function handleCancelDelete() {
    setDeleteMode(false);
    setTaskToDelete(null);
  }

  function handleConfirmDelete() {
    setTodo(todo.filter((item) => item.id !== taskToDelete.id));
    setDeleteMode(false);
    setTaskToDelete(null);
  }

  return (
    <>
      <div className="container">
        <h1>Danh sách công việc</h1>
        <div className="input-list">
          <input
            ref={inputRef}
            className="input-todo"
            type="text"
            placeholder="Nhập tên công việc"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
          <button className="add-button" onClick={addTask}>
            Thêm
          </button>
        </div>
        {todo.length === 0 ? (
          <div className="no-data">
            <img
              src="https://static.vecteezy.com/system/resources/thumbnails/021/975/492/small/search-not-found-3d-render-icon-illustration-with-transparent-background-empty-state-png.png"
              alt="No data"
            />
          </div>
        ) : (
          <ul>
            {todo.map((item) => (
              <li key={item.id}>
                <div className="todo-name">
                  <input
                    type="checkbox"
                    checked={item.status}
                    onChange={() => handleStatusChange(item.id)}
                  />
                  <p className={item.status ? "completed" : ""}>{item.name}</p>
                </div>

                <div>
                  <button onClick={() => handleEdit(item)}>
                    <AiOutlineEdit />
                  </button>
                  <button onClick={() => handleDeleteRequest(item)}>
                    <AiOutlineDelete />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        {todo.length > 0 && (
          <div className="alert-todo">
            <p>
              {completedTasks === todo.length && todo.length > 0
                ? "Đã hoàn thành tất cả công việc"
                : `Công việc đã hoàn thành: ${completedTasks}`}
            </p>
          </div>
        )}
      </div>
      {deleteMode && (
        <div className="overlay">
          <div className="modal-delete">
            <h2>Xác nhận</h2>
            <p>
              Bạn có chắc muốn xóa công việc <span>{taskToDelete.name} </span>
              không?
            </p>
            <div className="button-group">
              <button
                type="button"
                onClick={handleCancelDelete}
                className="cancel-button"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="yes-button"
              >
                Đồng ý
              </button>
            </div>
          </div>
        </div>
      )}
      {editMode && (
        <div className="modal-edit">
          <form onSubmit={handleUpdate}>
            <h1>Cập nhật công việc</h1>
            <div className="job-name-change">
              <label>Tên công việc</label>
              <input
                type="text"
                value={currentTask.name}
                onChange={handleNameChange}
                required
              />
              {nameError && <p>{nameError}</p>}
            </div>

            <div className="update-button">
              <button
                className="cancel-button"
                type="button"
                onClick={handleCancel}
              >
                Hủy
              </button>
              <button type="submit" className="yes-button">
                Đồng ý
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default TodoList;
