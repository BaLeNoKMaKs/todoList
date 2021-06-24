import Axios from "axios";
import React, { useState, useEffect } from "react";
import List from "../List/List";

import "./ListAddBtn.scss";

export default function ListAddBtn({ colors, onAddFolder }) {
  const [isShow, setIsShow] = useState(false);
  const [selectedColor, setSelectedColor] = useState(1);
  const [addInp, setAddInp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (Array.isArray(colors)) {
      setSelectedColor(colors[0].id);
    }
  }, [colors]);

  const onAdd = () => {
    if (!addInp) {
      alert("Введите название списка");
      return;
    }
    setIsLoading(true);
    Axios.post("http://localhost:3000/lists", {
      text: addInp,
      colorId: selectedColor,
    })
      .then(({ data }) => {
        const color = colors.filter((c) => c.id === selectedColor)[0];
        const listObj = { ...data, color, tasks: [] };
        onAddFolder(listObj);
      })
      .catch(() => {
        alert("Ошибка при добавлении списка!");
      })
      .finally(() => {
        setIsShow(false);
        setIsLoading(false);
        setAddInp("");
        setSelectedColor(colors[0].id);
      });
  };

  return (
    <div className="add-list">
      <List
        onClick={() => setIsShow(!isShow)}
        items={[
          {
            id: 1,
            icon: (
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
            ),
            text: "Добавить папку",
            active: false,
          },
        ]}
      />
      {isShow && (
        <div className="add-list__popup">
          <input
            value={addInp}
            onChange={(e) => setAddInp(e.target.value)}
            type="text"
            className="inp add-list__inp"
            placeholder="Название папки"
          />
          <div className="add-list__colors">
            {colors &&
              colors.map((color) => {
                const { hex, id } = color;
                return (
                  <div
                    key={id}
                    onClick={() => setSelectedColor(id)}
                    className={
                      selectedColor === id
                        ? "add-list__color _active"
                        : "add-list__color"
                    }
                    style={{ background: hex }}
                  ></div>
                );
              })}
          </div>
          <button className="btn green" onClick={onAdd}>
            {isLoading ? "Добавление..." : "Добавить"}
          </button>
          <button
            className="add-list__close"
            onClick={() => {
              setIsShow(!isShow);
            }}
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.24741 5L9.73899 1.50842C9.9047 1.343 9.99791 1.11853 9.99812 0.884393C9.99832 0.650251 9.90551 0.425617 9.74009 0.259907C9.57468 0.0941973 9.35021 0.000986589 9.11606 0.000779811C8.88192 0.000573033 8.65729 0.0933872 8.49158 0.258804L5 3.75038L1.50842 0.258804C1.34271 0.0930948 1.11796 0 0.883613 0C0.649264 0 0.424514 0.0930948 0.258804 0.258804C0.0930948 0.424514 0 0.649264 0 0.883613C0 1.11796 0.0930948 1.34271 0.258804 1.50842L3.75038 5L0.258804 8.49158C0.0930948 8.65729 0 8.88204 0 9.11639C0 9.35074 0.0930948 9.57549 0.258804 9.7412C0.424514 9.90691 0.649264 10 0.883613 10C1.11796 10 1.34271 9.90691 1.50842 9.7412L5 6.24962L8.49158 9.7412C8.65729 9.90691 8.88204 10 9.11639 10C9.35074 10 9.57549 9.90691 9.7412 9.7412C9.90691 9.57549 10 9.35074 10 9.11639C10 8.88204 9.90691 8.65729 9.7412 8.49158L6.24741 5Z"
                fill="#E3E3E3"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
