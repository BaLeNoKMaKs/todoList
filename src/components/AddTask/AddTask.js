import Axios from "axios";
import React, { useState } from "react";
import "./addTask.scss";

export default function AddTask({ list, onAddTask }) {
  const [isShow, setIsShow] = useState(false);
  const [isLoading, setIsLoading] = useState("");
  const [inpVal, setInpVal] = useState("");

  const toggleFormVisible = () => {
    setIsShow(!isShow);
    setInpVal("");
  };

  const addTask = () => {
    const obj = {
      listId: list.id,
      text: inpVal,
      completed: false,
    };

    setIsLoading(true);
    Axios.post("http://localhost:3000/tasks", obj)
      .then(({ data }) => {
        onAddTask(list.id, data);
        toggleFormVisible();
      })
      .catch((e) => {
        alert("Ошибка при добавлении задачи!");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="add-task">
      {!isShow ? (
        <div
          className="add-task__icon-menu"
          onClick={() => toggleFormVisible(!isShow)}
        >
          <div className="add-task__icon">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 1V11"
                stroke="#868686"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M1 6H11"
                stroke="#868686"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="add-task__text">Новая задача</div>
        </div>
      ) : (
        <div className="add-task__add-menu">
          <input
            value={inpVal}
            onChange={(e) => setInpVal(e.target.value)}
            autoComplete="off"
            type="text"
            placeholder="Текст задачи"
            className="inp"
          />
          <div className="add-task__btns">
            <button className="btn green" onClick={addTask}>
              {isLoading ? "Добваление..." : "Добавить задачу"}
            </button>
            <button
              className="btn grey"
              onClick={() => toggleFormVisible(!isShow)}
            >
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
