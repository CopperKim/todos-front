import { useMemo, useState } from "react";
import {
  useGetTodosQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
  type Todo,
} from "../services/todoApi";

function formatDue(due?: number | string | null) { 
  if (!due && due !== 0) return "";
  const n = typeof due === "string" ? Number(due) : due;
  if (!Number.isFinite(n)) return String(due);
  const d = new Date(n);
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
}

function toTimestamp(local: string) { // input[type=datetime-local] → number(ms), 빈 값이면 undefined
  return local ? new Date(local).getTime() : undefined;
}

function toLocalDatetimeInput(ms?: number | string | null) { // return ISO date format 
  if (!ms && ms !== 0) return "";
  const n = typeof ms === "string" ? Number(ms) : ms;
  if (!Number.isFinite(n)) return "";
  const d = new Date(n); // YYYY-MM-DDTHH:mm 형식
  const pad = (x: number) => String(x).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

export const TodosPage = () => {
  const { data: todos, isLoading, isFetching, isError, refetch } = useGetTodosQuery();
  const [addTodo, { isLoading: adding }] = useAddTodoMutation();
  const [updateTodo] = useUpdateTodoMutation();
  const [deleteTodo] = useDeleteTodoMutation();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [dueLocal, setDueLocal] = useState(""); // datetime-local 값

  const sorted = useMemo(() => {
    if (!todos) return [];
    return [...todos].sort((a, b) => {
      const ad = (a.dueDate ?? 0) as any;
      const bd = (b.dueDate ?? 0) as any;
      return Number(ad) - Number(bd);
    });
  }, [todos]);

  if (isLoading) return <div style={{ padding: 24 }}>불러오는 중…</div>;
  if (isError) {
    return (
      <div style={{ padding: 24 }}>
        로드 실패.
        <button onClick={() => refetch()} style={{ marginLeft: 8 }}>
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ display: "flex", alignItems: "center", gap: 8 }}>
        Todos {isFetching && <small>…동기화중</small>}
      </h1>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!title.trim()) return;
          const dueDate = toTimestamp(dueLocal); // undefined면 서버에서 Date.now()로 채움
          await addTodo({ title: title.trim(), content: content.trim() || undefined, dueDate }).unwrap();
          setTitle("");
          setContent("");
          setDueLocal("");
        }}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
          margin: "16px 0 24px",
          alignItems: "center",
        }}
      >
        <input
          placeholder="제목 *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ gridColumn: "1 / span 2" }}
        />
        <textarea
          placeholder="내용(선택)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          style={{ gridColumn: "1 / span 2" }}
        />
        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span>마감</span>
          <input
            type="datetime-local"
            value={dueLocal}
            onChange={(e) => setDueLocal(e.target.value)}
          />
        </label>
        <div style={{ textAlign: "right" }}>
          <button type="submit" disabled={adding || !title.trim()}>
            {adding ? "추가 중…" : "추가"}
          </button>
        </div>
      </form>

      <ul style={{ display: "grid", gap: 12, padding: 0, listStyle: "none" }}>
        {sorted.map((t) => (
          <TodoItem
            key={t.id}
            todo={t}
            onEdit={async (patch) => {
              console.log(t.id)
              await updateTodo({ id: t.id, patch }).unwrap();
            }}
            onDelete={async () => {
              if (confirm("삭제하시겠습니까?")) {
                await deleteTodo(t.id).unwrap();
              }
            }}
          />
        ))}
        {sorted.length === 0 && <li style={{ opacity: 0.7 }}>할 일이 없습니다.</li>}
      </ul>
    </div>
  );
}

function TodoItem({
  todo,
  onEdit,
  onDelete,
}: {
  todo: Todo;
  onEdit: (patch: Partial<Pick<Todo, "title" | "content" | "dueDate">>) => Promise<any>;
  onDelete: () => Promise<any>;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title ?? "");
  const [content, setContent] = useState(todo.content ?? "");
  const [dueLocal, setDueLocal] = useState(toLocalDatetimeInput(todo.dueDate));

  return (
    <li style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
      {editing ? (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const patch: any = { title: title.trim() };
            if (content.trim().length) patch.content = content.trim();
            else patch.content = ""; 
            const ts = toTimestamp(dueLocal);
            if (ts) patch.dueDate = ts;
            await onEdit(patch);
            setEditing(false);
          }}
          style={{ display: "grid", gap: 8 }}
        >
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
          <textarea rows={3} value={content} onChange={(e) => setContent(e.target.value)} />
          <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span>마감</span>
            <input
              type="datetime-local"
              value={dueLocal}
              onChange={(e) => setDueLocal(e.target.value)}
            />
            <span style={{ opacity: 0.7, fontSize: 12 }}>{formatDue(todo.dueDate)}</span>
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="submit">저장</button>
            <button type="button" onClick={() => setEditing(false)}>
              취소
            </button>
          </div>
        </form>
      ) : (
        <>
          <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
            <strong>{todo.title}</strong>
            <span style={{ marginLeft: "auto", fontSize: 12, opacity: 0.7 }}>
              {formatDue(todo.dueDate)}
            </span>
          </div>
          {todo.content && <p style={{ margin: "8px 0 0" }}>{todo.content}</p>}
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button onClick={() => setEditing(true)}>수정</button>
            <button onClick={onDelete}>삭제</button>
          </div>
        </>
      )}
    </li>
  );
}
