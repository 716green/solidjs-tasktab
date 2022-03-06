import styles from "./App.module.css";
import { createEffect, createSignal, For, onMount } from "solid-js";
import { v4 as uuidv4 } from "uuid";

const [taskInput, setTaskInput] = createSignal("");
const [tasks, setTasks] = createSignal([]);
const [newTasks, setNewTasks] = createSignal([]);
const [editingTask, setEditingTask] = createSignal("");

onMount(() => {
  const cachedTasks = localStorage.getItem("taskTabTasks");
  console.log({ cachedTasks });
  setNewTasks(JSON.parse(cachedTasks));
});

const addTaskHandler = (e) => {
  e.preventDefault();
  if (!taskInput()) return;
  setTasks([
    ...tasks(),
    { id: uuidv4(), task: taskInput(), edit: false, status: "pending" },
  ]);
  setTaskInput("");
};

const editTaskHandler = (id) => {
  const newTasks = tasks().map((task) => {
    if (task.id === id) setEditingTask(task.task);
    return task.id === id ? { ...task, edit: true } : { ...task, edit: false };
  });
  setNewTasks(newTasks);
};

const modifyTaskHandler = (e, id) => {
  if (e.key === "Enter") {
    saveTask(id);
  } else if (e.key === "Escape") {
    cancelEdit();
  }
  setEditingTask(e.target.value);
};

const saveTask = (id) => {
  const newTasks = tasks().map((task) => {
    return task.id === id
      ? { id: task.id, task: editingTask(), edit: false }
      : task;
  });
  setNewTasks(newTasks);
  localStorage.setItem("taskTabTasks", JSON.stringify(newTasks));
};

const cancelEdit = () => {
  const newTasks = tasks().map((task) => ({ ...task, edit: false }));
  setNewTasks(newTasks);
};

createEffect(() => {
  setTasks(newTasks());
});

function App() {
  return (
    <section class={styles.wrapper}>
      <div style={{ width: "34%" }}>
        <form style={{ width: "100%" }}>
          <input
            type="text"
            value={taskInput()}
            onKeyUp={(e) => setTaskInput(e.target.value)}
          />
          <button style={{ display: "none" }} onClick={addTaskHandler}>
            Add Task
          </button>
        </form>
        <For each={tasks()}>
          {(task) =>
            task.edit ? (
              <input
                type="text"
                value={editingTask()}
                onFocusOut={() => saveTask(task.id)}
                onKeyUp={(e) => modifyTaskHandler(e, task.id)}
              />
            ) : (
              <li
                key={task.id}
                onClick={() => editTaskHandler(task.id)}
                class={styles.list}
              >
                {task.task}
              </li>
            )
          }
        </For>
      </div>
    </section>
  );
}

export default App;
