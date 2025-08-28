import { useMemo, useState } from "react";
import { useAddRecruitMutation, useDeleteRecruitMutation, useGetRecruitQuery, useUpdateRecruitMutation } from "../services/recruitApi";

export const StudentRecruitPage = () => {
    const { data: recruit, isLoading, isFetching, isError, refetch } = useGetRecruitQuery({author: true});
    const [addRecruit, { isLoading: adding }] = useAddRecruitMutation();
    const [updateRecruit] = useUpdateRecruitMutation();
    const [deleteRecruit] = useDeleteRecruitMutation();

    const [title, setTitle] = useState(""); 
    const [content, setContent] = useState(""); 
    const [dayAvilable, setDayAvailable] = useState([true, true, true, true, true, true, true])
    const [tags, setTags] = useState([])

    const sorted = useMemo(() => {
        if (!recruit) return [];
        return [...recruit].sort((a, b) => {
          const ad = (a.updatedAt ?? 0) as any;
          const bd = (b.updatedAt ?? 0) as any;
          return Number(ad) - Number(bd);
        });
      }, [recruit]);

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
                Recruitment Page for Students {isFetching && <small>…동기화중</small>}
            </h1>

            <form
                onSubmit= {async (e) => {
                    e.preventDefault(); 
                    if (!title.trim()) return; 
                    await addRecruit({title: title.trim(), content: content.trim(), dayAvailable: dayAvilable, tags: tags}); 
                    setTitle("");
                    setContent(""); 
                    setDayAvailable([true, true, true, true, true, true, true]);
                    setTags([]); 
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
                {/* <select
                    value={}
                    onChange={(e) => dispatch()}
                >
                    <option value="MON">UNDEFINED</option>
                    <option value="TUE">TEACHER</option>
                    <option value="WED">STUDENT</option>
                </select> */}
                <div style={{ textAlign: "right" }}>
                    <button type="submit" disabled={adding || !title.trim()}>
                        {adding ? "추가 중…" : "추가"}
                    </button>
                </div>
            </form>
        </div>
    )
}