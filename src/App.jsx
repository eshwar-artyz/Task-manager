import { useEffect, useState, useRef } from "react";

const toast = {
  error: (msg) => console.error(msg),
  success: (msg) => console.log(msg),
};

let mockTasks = [
  { id: 1, task: "Design the new landing page" },
  { id: 2, task: "Review pull requests" },
  { id: 3, task: "Write unit tests for auth module" },
];
const mockAxios = {
  get: () => Promise.resolve({ data: [...mockTasks] }),
  post: (_, body) => { mockTasks.push(body); return Promise.resolve(); },
  delete: (url) => {
    const id = Number(url.split("/").pop());
    mockTasks = mockTasks.filter(t => t.id !== id);
    return Promise.resolve();
  },
};

export default function App() {
  const todotask = useRef();
  const [task, setTask] = useState("");
  const [data, setData] = useState([]);
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    mockAxios.get("http://localhost:1000/task")
      .then((res) => setData(res.data.task || res.data || []))
      .catch(() => toast.error("Failed to fetch tasks"));
  }, []);

  const addTask = (e) => {
    e.preventDefault();
    const value = todotask.current.value.trim();
    if (!value) return toast.error("Enter a task");
    const newTask = { id: Date.now(), task: value };
    setAdding(true);
    mockAxios.post("http://localhost:1000/task", newTask)
      .then(() => {
        setData((prev) => [...prev, newTask]);
        todotask.current.value = "";
        toast.success("Task added");
      })
      .catch(() => toast.error("Failed to add task"))
      .finally(() => setAdding(false));
  };

  const deleteTask = (id) => {
    setDeletingId(id);
    mockAxios.delete(`http://localhost:1000/task/${id}`)
      .then(() => {
        setData((prev) => prev.filter((item) => item.id !== id));
        toast.success("Task deleted");
      })
      .catch(() => toast.error("Failed to delete task"))
      .finally(() => setDeletingId(null));
  };

  const filteredTasks = data.filter((item) =>
    item.task.toLowerCase().includes(task.toLowerCase())
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Lato:wght@300;400;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #f5f0e8;
          min-height: 100vh;
        }

        .tm-root {
          min-height: 100vh;
          background: #f5f0e8;
          background-image:
            radial-gradient(circle at 15% 20%, #e8dfd0 0%, transparent 50%),
            radial-gradient(circle at 85% 80%, #ddd5c5 0%, transparent 50%);
          font-family: 'Lato', sans-serif;
          padding: 48px 20px 80px;
        }

        .tm-card {
          max-width: 680px;
          margin: 0 auto;
          background: #fffdf9;
          border-radius: 3px;
          box-shadow:
            0 1px 2px rgba(0,0,0,0.04),
            0 8px 32px rgba(0,0,0,0.08),
            0 0 0 1px rgba(0,0,0,0.04);
          overflow: hidden;
        }

        .tm-header {
          background: #1c1916;
          padding: 36px 40px 32px;
          position: relative;
          overflow: hidden;
        }
        .tm-header::before {
          content: '';
          position: absolute;
          top: -40px; right: -40px;
          width: 180px; height: 180px;
          border-radius: 50%;
          background: rgba(255,255,255,0.03);
        }
        .tm-header::after {
          content: '';
          position: absolute;
          bottom: -60px; left: 60px;
          width: 240px; height: 240px;
          border-radius: 50%;
          background: rgba(255,255,255,0.02);
        }

        .tm-eyebrow {
          font-family: 'Lato', sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.35em;
          color: #c8a96e;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .tm-title {
          font-family: 'Playfair Display', serif;
          font-size: 38px;
          color: #fffdf9;
          line-height: 1.1;
          letter-spacing: -0.01em;
        }

        .tm-count {
          margin-top: 14px;
          font-size: 12px;
          color: #6b6560;
          letter-spacing: 0.1em;
        }
        .tm-count span {
          color: #c8a96e;
          font-weight: 700;
        }

        .tm-body {
          padding: 36px 40px 40px;
        }

        /* Add form */
        .tm-form {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }

        .tm-input {
          flex: 1;
          border: 1.5px solid #e0d9ce;
          border-radius: 2px;
          padding: 13px 16px;
          font-family: 'Lato', sans-serif;
          font-size: 14px;
          color: #1c1916;
          background: #fdfaf5;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .tm-input::placeholder { color: #bbb5aa; }
        .tm-input:focus {
          border-color: #c8a96e;
          box-shadow: 0 0 0 3px rgba(200,169,110,0.12);
        }

        .tm-add-btn {
          background: #1c1916;
          color: #fffdf9;
          border: none;
          border-radius: 2px;
          padding: 13px 24px;
          font-family: 'Lato', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          white-space: nowrap;
        }
        .tm-add-btn:hover { background: #c8a96e; }
        .tm-add-btn:active { transform: scale(0.97); }
        .tm-add-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Search */
        .tm-search-wrap {
          position: relative;
          margin-bottom: 28px;
        }
        .tm-search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #bbb5aa;
          pointer-events: none;
        }
        .tm-search {
          width: 100%;
          border: 1.5px solid #e0d9ce;
          border-radius: 2px;
          padding: 11px 16px 11px 40px;
          font-family: 'Lato', sans-serif;
          font-size: 13px;
          color: #1c1916;
          background: #fdfaf5;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .tm-search::placeholder { color: #bbb5aa; }
        .tm-search:focus {
          border-color: #c8a96e;
          box-shadow: 0 0 0 3px rgba(200,169,110,0.12);
        }

        /* Divider */
        .tm-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #e0d9ce 20%, #e0d9ce 80%, transparent);
          margin-bottom: 28px;
        }

        /* Task list */
        .tm-empty {
          text-align: center;
          padding: 48px 0;
          color: #bbb5aa;
          font-size: 13px;
          letter-spacing: 0.05em;
        }
        .tm-empty-icon {
          font-size: 32px;
          margin-bottom: 12px;
          opacity: 0.4;
        }

        .tm-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .tm-task-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 18px;
          background: #fdfaf5;
          border: 1.5px solid #e8e2d8;
          border-radius: 2px;
          transition: border-color 0.2s, box-shadow 0.2s, opacity 0.2s, transform 0.2s;
          animation: slideIn 0.25s ease both;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .tm-task-item:hover {
          border-color: #c8a96e;
          box-shadow: 0 2px 12px rgba(200,169,110,0.1);
        }
        .tm-task-item.deleting {
          opacity: 0.4;
          transform: scale(0.98);
        }

        .tm-bullet {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #c8a96e;
          flex-shrink: 0;
        }

        .tm-task-text {
          flex: 1;
          font-size: 14px;
          color: #2c2825;
          font-weight: 400;
          line-height: 1.4;
          letter-spacing: 0.01em;
        }

        .tm-delete-btn {
          background: none;
          border: 1.5px solid transparent;
          border-radius: 2px;
          color: #ccc5ba;
          cursor: pointer;
          padding: 6px 8px;
          display: flex;
          align-items: center;
          transition: color 0.18s, border-color 0.18s, background 0.18s;
          flex-shrink: 0;
        }
        .tm-delete-btn:hover {
          color: #c0392b;
          border-color: #f5c6c2;
          background: #fdf0ef;
        }

        .tm-footer {
          padding: 16px 40px 20px;
          border-top: 1px solid #ede8e0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .tm-footer-text {
          font-size: 11px;
          color: #c8bfb2;
          letter-spacing: 0.1em;
        }
        .tm-footer-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #c8a96e;
          opacity: 0.5;
        }
      `}</style>

      <div className="tm-root">
        <div className="tm-card">

          {/* Header */}
          <div className="tm-header">
            <div className="tm-eyebrow">Workspace</div>
            <div className="tm-title">Task Manager</div>
            <div className="tm-count">
              <span>{filteredTasks.length}</span> task{filteredTasks.length !== 1 ? "s" : ""} {task ? "found" : "pending"}
            </div>
          </div>

          {/* Body */}
          <div className="tm-body">

            {/* Add Task Form */}
            <form onSubmit={addTask} className="tm-form">
              <input
                ref={todotask}
                type="text"
                placeholder="Add a new task..."
                className="tm-input"
              />
              <button type="submit" className="tm-add-btn" disabled={adding}>
                {adding ? "Adding…" : "+ Add"}
              </button>
            </form>

            {/* Search */}
            <div className="tm-search-wrap">
              <svg className="tm-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                value={task}
                onChange={(e) => setTask(e.target.value)}
                type="text"
                placeholder="Search tasks..."
                className="tm-search"
              />
            </div>

            <div className="tm-divider" />

            {/* Task List */}
            {filteredTasks.length === 0 ? (
              <div className="tm-empty">
                <div className="tm-empty-icon">📋</div>
                {task ? `No tasks matching "${task}"` : "No tasks yet. Add one above!"}
              </div>
            ) : (
              <div className="tm-list">
                {filteredTasks.map((item) => (
                  <div
                    key={item.id}
                    className={`tm-task-item ${deletingId === item.id ? "deleting" : ""}`}
                  >
                    <div className="tm-bullet" />
                    <span className="tm-task-text">{item.task}</span>
                    <button
                      className="tm-delete-btn"
                      onClick={() => deleteTask(item.id)}
                      disabled={deletingId === item.id}
                      title="Delete task"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="tm-footer">
            <span className="tm-footer-text">TASK MANAGER</span>
            <div className="tm-footer-dot" />
            <span className="tm-footer-text">{new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
          </div>

        </div>
      </div>
    </>
  );
}