import { useSelector } from "react-redux";
import { useAppDispatch } from "../redux/hooks";
import { useGetRecruitByOptQuery, type getRecruitOpts } from "../services/recruitApi";
import { addTag, removeTag, selectFilters, selectSelectedId, setFilters, setNewTag } from "../redux/slices/teacherRecruitSlice";
import { RecruitItem } from "../components/recruitItem";

export const TeacherRecruitPage = () => {
    const filters: Omit<getRecruitOpts, "myRecruit"> & { newTag: string } = useSelector(selectFilters)
    // const selectedId = useSelector(selectSelectedId)

    const dispatch = useAppDispatch()

    const { data: recruit, isLoading, isFetching, isError, refetch } = useGetRecruitByOptQuery({ myRecruit: false, ...filters});

    if (isLoading) return <div style={{ padding: 24 }}>불러오는 중…</div>;
    if (isError) {
        console.log(recruit) 
        return (
        <div style={{ padding: 24 }}>
            로드 실패.
            <button onClick={refetch} style={{ marginLeft: 8 }}>
            다시 시도
            </button>
        </div>
        );
    }

    return (
        <div style={{ display: "flex", width: "100%", height: "100vh" }}>
            <div style={{ width: "640px" }}>
                <h1 style={{ display: "flex", alignItems: "center", gap: 8 }}>
                Recruitment Page for Teachers {isFetching && <small>…동기화중</small>}
                </h1>

                {recruit?.map((t) => (
                    <RecruitItem
                        key={t.id}
                        recruit={t}
                    />))}
            </div>
            <div style={{ flex: 1 }}>
                <button onClick={refetch}>검색</button>
                <select
                    value={filters.mode}
                    onChange={(e) => dispatch(setFilters({mode: e.target.value as any}))}
                >
                    <option value="AND">AND</option>
                    <option value="OR">OR</option>
                </select>
                <div>
                    tags: 
                    {filters.tags?.map((t: any)=> (
                        <span key={t}>
                            {t}
                            <button onClick={() => {dispatch(removeTag(t))}}>x</button>
                        </span>
                    ))}
                    <input
                        value={filters.newTag}
                        onChange={(e) => dispatch(setNewTag(e.target.value))}
                        placeholder="태그 추가"
                        onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            dispatch(addTag());
                            dispatch(setNewTag(""))
                        }

                        
                        }}
                        style={{ minWidth: 120 }}
                    />
                    {/* <button onClick={() => {addTag()}}>태그 추가</button> */}
                </div>
            </div>
        </div>
    )
}