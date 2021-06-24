import Axios from "axios";
import React, { useState, useEffect } from "react";
import "./App.scss";
import List from "./components/List/List";
import ListAddBtn from "./components/ListAddBtn/ListAddBtn";
import Tasks from "./components/Tasks/Tasks";

import { Route, useHistory, useLocation } from "react-router-dom";

function App() {
  const [lists, setLists] = useState(null);
  const [colors, setColors] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  let history = useHistory();
  let location = useLocation();

  const onAddFolder = (object) => {
    const newLists = [...lists, object];
    setLists(newLists);
  };

  const onEditTitle = (id, text) => {
    const newLists = lists.map((el) => {
      if (el.id === id) {
        el.text = text;
      }
      return el;
    });
    setLists(newLists);
  };

  const onAddTask = (listId, taskObj) => {
    const newList = lists.map((item) => {
      if (item.id === listId) {
        item.tasks = [...item.tasks, taskObj];
      }
      return item;
    });
    setLists(newList);
  };

  const onRemove = (id) => {
    Axios.delete(`http://localhost:3000/lists/${id}`).then(() => {
      const newLists = lists.filter((item) => {
        return item.id !== id;
      });
      setLists(newLists);
    });
  };

  useEffect(() => {
    Axios.get("http://localhost:3000/lists?_expand=color&_embed=tasks").then(
      ({ data }) => {
        setLists(data);
      }
    );
    Axios.get("http://localhost:3000/colors").then(({ data }) => {
      setColors(data);
    });
  }, []);

  const onEditTask = (listId, taskObj) => {
    const newTaskText = window.prompt("Текст задачи", taskObj.text);

    if (!newTaskText) {
      return;
    }

    const newList = lists.map((list) => {
      if (list.id === listId) {
        list.tasks = list.tasks.map((task) => {
          if (task.id === taskObj.id) {
            task.text = newTaskText;
          }
          return task;
        });
      }
      return list;
    });
    setLists(newList);
    Axios.patch("http://localhost:3000/tasks/" + taskObj.id, {
      text: newTaskText,
    }).catch(() => {
      alert("Не удалось обновить задачу");
    });
  };

  const onRemoveTask = (listId, taskId) => {
    if (window.confirm("Вы действительно хотите удалить задачу?")) {
      const newList = lists.map((item) => {
        if (item.id === listId) {
          item.tasks = item.tasks.filter((task) => task.id !== taskId);
        }
        return item;
      });
      setLists(newList);
      Axios.delete("http://localhost:3000/tasks/" + taskId).catch(() => {
        alert("Не удалось удалить задачу");
      });
    }
  };

  const onCompleteTask = (listId, taskId, completed) => {
    const newList = lists.map((list) => {
      if (list.id === listId) {
        list.tasks = list.tasks.map((task) => {
          if (task.id === taskId) {
            task.completed = completed;
          }
          return task;
        });
      }
      return list;
    });
    setLists(newList);
    Axios.patch("http://localhost:3000/tasks/" + taskId, {
      completed,
    }).catch(() => {
      alert("Не удалось обновить задачу");
    });
  };

  useEffect(() => {
    const listId = history.location.pathname.split("lists/")[1];
    if (lists) {
      const list = lists.find((list) => list.id === Number(listId));
      setActiveItem(list);
    }
  }, [lists, history.location.pathname]);

  return (
    <div className="todo _container">
      <div className="todo__sidebar ">
        <List
          onClickItem={() => {
            history.push(`/`);
          }}
          active={history.location.pathname === "/"}
          items={[
            {
              id: 1,
              icon: (
                <svg
                  width="14"
                  height="12"
                  viewBox="0 0 14 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.96 5.10001H5.74001C5.24321 5.10001 5.20001 5.50231 5.20001 6.00001C5.20001 6.49771 5.24321 6.90001 5.74001 6.90001H10.96C11.4568 6.90001 11.5 6.49771 11.5 6.00001C11.5 5.50231 11.4568 5.10001 10.96 5.10001ZM12.76 9.60001H5.74001C5.24321 9.60001 5.20001 10.0023 5.20001 10.5C5.20001 10.9977 5.24321 11.4 5.74001 11.4H12.76C13.2568 11.4 13.3 10.9977 13.3 10.5C13.3 10.0023 13.2568 9.60001 12.76 9.60001ZM5.74001 2.40001H12.76C13.2568 2.40001 13.3 1.99771 13.3 1.50001C13.3 1.00231 13.2568 0.600006 12.76 0.600006H5.74001C5.24321 0.600006 5.20001 1.00231 5.20001 1.50001C5.20001 1.99771 5.24321 2.40001 5.74001 2.40001ZM2.86001 5.10001H1.24001C0.743212 5.10001 0.700012 5.50231 0.700012 6.00001C0.700012 6.49771 0.743212 6.90001 1.24001 6.90001H2.86001C3.35681 6.90001 3.40001 6.49771 3.40001 6.00001C3.40001 5.50231 3.35681 5.10001 2.86001 5.10001ZM2.86001 9.60001H1.24001C0.743212 9.60001 0.700012 10.0023 0.700012 10.5C0.700012 10.9977 0.743212 11.4 1.24001 11.4H2.86001C3.35681 11.4 3.40001 10.9977 3.40001 10.5C3.40001 10.0023 3.35681 9.60001 2.86001 9.60001ZM2.86001 0.600006H1.24001C0.743212 0.600006 0.700012 1.00231 0.700012 1.50001C0.700012 1.99771 0.743212 2.40001 1.24001 2.40001H2.86001C3.35681 2.40001 3.40001 1.99771 3.40001 1.50001C3.40001 1.00231 3.35681 0.600006 2.86001 0.600006Z"
                    fill="#7C7C7C"
                  />
                </svg>
              ),
              text: "Все задачи",
            },
          ]}
        />
        <List
          items={lists}
          onRemove={(id) => onRemove(id)}
          onClickItem={(list) => {
            history.push(`/lists/${list.id}`);
          }}
          activeItem={activeItem}
        />
        <ListAddBtn
          colors={colors}
          onAddFolder={(object) => onAddFolder(object)}
        />
      </div>
      <div className="todo__tasks">
        <Route exact path="/">
          {lists &&
            lists.map((list) => {
              return (
                <Tasks
                  key={list.id}
                  onEditTitle={(id, text) => onEditTitle(id, text)}
                  item={list}
                  onAddTask={onAddTask}
                  onCompleteTask={onCompleteTask}
                  onEditTask={onEditTask}
                  onRemoveTask={onRemoveTask}
                />
              );
            })}
        </Route>
        <Route path="/lists/:id">
          {activeItem && (
            <Tasks
              onEditTitle={(id, text) => onEditTitle(id, text)}
              item={activeItem}
              onAddTask={onAddTask}
              onCompleteTask={onCompleteTask}
              onEditTask={onEditTask}
              onRemoveTask={onRemoveTask}
            />
          )}
        </Route>
      </div>
    </div>
  );
}

export default App;
