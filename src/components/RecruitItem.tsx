import { useEffect, useState } from "react";
import type { Recruit } from "../services/recruitApi";
import { DayPicker } from "./dayPicker";

export const RecruitItem = ({
  recruit,
  onEdit,
  onDelete,
  onClick
}: {
  recruit: Recruit;
  onEdit?: (patch: Partial<Recruit>) => Promise<any>;
  onDelete?: () => Promise<any>;
  onClick?: () => Promise<any>;
}) => {
  const canEdit = !!onEdit && !!onDelete 

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(recruit.title);
  const [content, setContent] = useState(recruit.content);
  const [dayAvilable, setDayAvailable] = useState(recruit.dayAvailable); // 표시만 (disabled)
  const [tags, setTags] = useState<string[]>(recruit.tags ?? []);
  const [newTag, setNewTag] = useState("");

  // recruit prop이 바뀌면, 편집 중이 아닐 때 로컬 값 동기화
  useEffect(() => {
    if (!editing) {
      setTitle(recruit.title);
      setContent(recruit.content);
      setDayAvailable(recruit.dayAvailable);
      setTags(recruit.tags ?? []);
    }
  }, [recruit, editing]);

  const addTag = () => {
    const v = newTag.trim();
    if (!v) return;
    if (!tags.includes(v)) setTags((prev) => [...prev, v]);
    setNewTag("");
  };

  const removeTag = (t: string) => {
    setTags((prev) => prev.filter((x) => x !== t));
  };

  const handleSave = async () => {
    if (!canEdit) return; 
    const next: Recruit = {
      // ...recruit,
      title: title.trim(),
      content: content.trim(),
      dayAvailable: [...dayAvilable], 
      tags: [...tags],
    };
    await onEdit(next);
    setEditing(false);
  };

  if (!canEdit) return (
    <li style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
      <>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <strong style={{ fontSize: 16 }}>{recruit.title}</strong>
            <span style={{ marginLeft: "auto", fontSize: 12, opacity: 0.7 }}>
            </span>
          </div>

          {recruit.content && (
            <p style={{ margin: "8px 0 12px", whiteSpace: "pre-wrap" }}>
              {recruit.content}
            </p>
          )}

          <div style={{ margin: "8px 0" }}>
            <DayPicker
              value={dayAvilable}
              onChange={setDayAvailable}
              disabled={true}
              showShortcuts={false}
              labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
            />
          </div>

          <div
            style={{
              width: "400px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 8,
            }}
          >
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {recruit.tags?.length ? (
                recruit.tags.map((t) => (
                  <span
                    key={t}
                    style={{
                      fontSize: 12,
                      padding: "2px 8px",
                      borderRadius: 999,
                      border: "1px solid #ccc",
                      background: "#f7f7f7",
                    }}
                  >
                    {t}
                  </span>
                ))
              ) : (
                <span style={{ opacity: 0.6, fontSize: 12 }}>태그 없음</span>
              )}
            </div>
            <button
              style={{
                padding: "4px 10px",
                fontSize: 12,
                borderRadius: 6,
                border: "1px solid #888",
                background: "#eee",
                cursor: "pointer",
              }}
              onClick={onClick}
            >
              채팅
            </button>
          </div>
        </>
    </li>
  ) 

  else if (editing) return (
    <li style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
      <>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <strong style={{ fontSize: 16 }}>{recruit.title}</strong>
            <span style={{ marginLeft: "auto", fontSize: 12, opacity: 0.7 }}>
            </span>
          </div>

          {recruit.content && (
            <p style={{ margin: "8px 0 12px", whiteSpace: "pre-wrap" }}>
              {recruit.content}
            </p>
          )}

          <div style={{ margin: "8px 0" }}>
            <DayPicker
              value={dayAvilable}
              onChange={setDayAvailable}
              disabled={true}
              showShortcuts={false}
              labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
            />
          </div>

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
            {recruit.tags?.length ? (
              recruit.tags.map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: 12,
                    padding: "2px 8px",
                    borderRadius: 999,
                    border: "1px solid #ccc",
                    background: "#f7f7f7",
                  }}
                >
                  {t}
                </span>
              ))
            ) : (
              <span style={{ opacity: 0.6, fontSize: 12 }}>태그 없음</span>
            )}
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button type="button" onClick={() => setEditing(true)}>
              수정
            </button>
            <button
              type="button"
              onClick={async () => {
                if (confirm("삭제하시겠습니까?")) await onDelete();
              }}
            >
              삭제
            </button>
          </div>
        </>
    </li>
  )

  else return (
    <li style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        style={{ display: "grid", gap: 8 }}
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="제목 *"
        />
        <textarea
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용"
        />

        <div>
          <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>
            가능한 요일
          </div>
          <DayPicker
            value={dayAvilable}
            onChange={(next: boolean[]) => setDayAvailable([...next])}
            disabled={false}
            showShortcuts={false}
            labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
          />
        </div>

        <div>
          <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>
            태그
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
            {tags.map((t) => (
              <span
                key={t}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 12,
                  padding: "2px 8px",
                  borderRadius: 999,
                  border: "1px solid #ccc",
                  background: "#f7f7f7",
                }}
              >
                {t}
                <button type="button" onClick={() => removeTag(t)} style={{ fontSize: 12 }}>
                  ×
                </button>
              </span>
            ))}
            <input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="태그 추가"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
              style={{ minWidth: 120 }}
            />
            <button type="button" onClick={addTag}>
              추가
            </button>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit">저장</button>
          <button type="button" onClick={() => setEditing(false)}>
            취소
          </button>
        </div>
      </form>
    </li>
  )
}