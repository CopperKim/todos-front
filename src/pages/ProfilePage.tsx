import { useGetProfileQuery, useUpdateProfileMutation } from '../services/ProfileApi'
import {
  startEdit, cancelEdit, setRole, setBio, addTag, removeTag,
  selectProfileView, selectIsEditingProfile
} from '../redux/slices/ProfileSlice'
import { useAppDispatch, useAppSelector } from '../redux/hooks'

export const ProfilePage = () => {
  // 1) 서버 데이터 로드 (RTKQ가 캐시에 넣어줌)
  const { data, isLoading, isError, error } = useGetProfileQuery()

  // 2) UI 전용 상태는 slice selector로
  const view = useAppSelector(selectProfileView)        // 편집 중이면 draft 합성, 아니면 server
  const isEditing = useAppSelector(selectIsEditingProfile)

  const dispatch = useAppDispatch()
  const [updateProfile, { isLoading: saving }] = useUpdateProfileMutation()

  if (isLoading) return <div>로딩...</div>
  if (isError || !view) {
    console.log(error)
    return <div>프로필을 불러올 수 없어요</div>
  }

  // 3) 이벤트 핸들러: slice 액션으로 드래프트 편집
  const onStart = () => dispatch(startEdit())
  const onCancel = () => dispatch(cancelEdit())
  const onSave = async () => {
    // view에는 server+draft가 합쳐져 있음 → 서버에 필요한 필드만 추려서 전송
    await updateProfile({ role: view.role, bio: view.bio, tag: view.tag }).unwrap()
    // 성공 시 extraReducers가 server 동기화 + 편집 종료 처리
  }

  return (
    <section>
      <div>username: {data?.username ?? '(비공개)'}</div>

      {!isEditing ? (
        <>
          <div>role: {view.role}</div>
          <div>bio: {view.bio}</div>
          <div>tag: {view.tag.join(', ')}</div>
          <button onClick={onStart}>수정</button>
        </>
      ) : (
        <>
          <div>
            role:
            <select
              value={view.role}
              onChange={(e) => dispatch(setRole(e.target.value as any))}
            >
              <option value="UNDEFINED">UNDEFINED</option>
              <option value="TEACHER">TEACHER</option>
              <option value="STUDENT">STUDENT</option>
            </select>
          </div>

          <div>
            bio:
            <textarea
              value={view.bio}
              onChange={(e) => dispatch(setBio(e.target.value))}
            />
          </div>

          <div>
            tag:
            {view.tag.map((t: any) => (
              <span key={t}>
                {t}
                <button onClick={() => dispatch(removeTag(t))}>x</button>
              </span>
            ))}
            <input
              placeholder="태그 추가"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const v = (e.target as HTMLInputElement).value.trim()
                  if (v) dispatch(addTag(v))
                  ;(e.target as HTMLInputElement).value = ''
                }
              }}
            />
          </div>

          <button disabled={saving} onClick={onSave}>저장</button>
          <button onClick={onCancel}>취소</button>
        </>
      )}
    </section>
  )
}
