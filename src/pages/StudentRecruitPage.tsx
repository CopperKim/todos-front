import { useMemo, useState } from "react";
import { useAddRecruitMutation, useDeleteRecruitMutation, useGetRecruitByOptQuery, useUpdateRecruitMutation } from "../services/recruitApi";
import { DayPicker } from "../components/dayPicker";
import { RecruitItem } from "../components/RecruitItem";

export const StudentRecruitPage = () => {
    const { data: recruit, isLoading, isFetching, isError, refetch } = useGetRecruitByOptQuery({ myRecruit: true });
    // console.log(data) 
    const recruits = useMemo(() => {
        if (!recruit) return [] 
        return recruit 
    }, [recruit])

    const [addRecruit, { isLoading: adding }] = useAddRecruitMutation();
    const [updateRecruit] = useUpdateRecruitMutation();
    const [deleteRecruit] = useDeleteRecruitMutation();

    const [title, setTitle] = useState("title"); 
    const [content, setContent] = useState("content"); 
    const [dayAvilable, setDayAvailable] = useState([true, true, true, true, true, true, true])
    const [tags, setTags] = useState(["tags"])
    const [newTag, setNewTag] = useState("")

    const addTag = () => {
        setTags((prev) => prev.includes(newTag) ? prev : [...prev, newTag])
    }
    const removeTag = (t: string) => {
        setTags((prev) => prev.filter((x) => x !== t));
    };

    // const sorted = useMemo(() => {
    //     if (!recruit) return [];
    //     return [...recruit].sort((a, b) => {
    //       const ad = (a.updatedAt ?? 0) as any;
    //       const bd = (b.updatedAt ?? 0) as any;
    //       return Number(ad) - Number(bd);
    //     });
    //   }, [recruit]);

    if (isLoading) return <div style={{ padding: 24 }}>불러오는 중…</div>;
    if (isError) {
        console.log(recruit) 
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
                    console.log({title: title.trim(), content: content.trim(), dayAvailable: dayAvilable, tags: tags});
                    console.log(await addRecruit({title: title.trim(), content: content.trim(), dayAvailable: dayAvilable, tags: tags})); 
                    setTitle("title");
                    setContent("content"); 
                    setDayAvailable([true, true, true, true, true, true, true]);
                    setTags(["tags"]); 
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
                <div>
                    tags: 
                    {tags.map((t: any)=> (
                        <span key={t}>
                            {t}
                            <button onClick={() => {removeTag(t)}}>x</button>
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
                            setNewTag("")
                        }
                        }}
                        style={{ minWidth: 120 }}
                    />
                    {/* <button onClick={() => {addTag()}}>태그 추가</button> */}
                </div>
                <DayPicker value={dayAvilable} onChange={setDayAvailable} labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}/>
                <div style={{ textAlign: "right" }}>
                    <button type="submit" disabled={adding || !title.trim()}>
                        {adding ? "추가 중…" : "추가"}
                    </button>
                </div>
            </form>

            {recruits?.map((t) => (
                <RecruitItem
                    key={t.id}
                    recruit={t}
                    onEdit={async (patch) => {
                        try {
                            await updateRecruit({ id: t.id, patch }).unwrap();
                        } catch (e: any) {
                            console.log('patch=', patch);
                            console.log('status=', e?.status);
                            console.log('messages=', e?.data?.message);
                        }}}
                    onDelete={async () => {await deleteRecruit(t.id)}}
                />
            ))}
        </div>
    )
}