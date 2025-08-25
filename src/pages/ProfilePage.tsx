import { useGetProfileQuery, useUpdateProfileMutation } from '../services/profileApi'
import {
  startEdit, cancelEdit, setRole, setBio, addTag, removeTag,
  selectProfileView, selectIsEditingProfile
} from '../redux/slices/profileSlice'
import { useAppDispatch, useAppSelector } from '../redux/hooks'

export const ProfilePage = () => {
  const { data, isLoading, isError, error } = useGetProfileQuery()

  const view = useAppSelector(selectProfileView)
  const isEditing = useAppSelector(selectIsEditingProfile)

  const dispatch = useAppDispatch()
  const [updateProfile, { isLoading: saving }] = useUpdateProfileMutation()

  if (isLoading) return <div>로딩...</div>
  if (isError || !view) {
    console.log(error)
    return <div>프로필을 불러올 수 없어요</div>
  }

  const onStart = () => dispatch(startEdit())
  const onCancel = () => dispatch(cancelEdit())
  const onSave = async () => {
    await updateProfile({ role: view.role, bio: view.bio, tag: view.tag }).unwrap()
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
