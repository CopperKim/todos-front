import { useState } from "react"
import type { Recruit } from "../services/recruitApi"

export const RecruitItem = ({
    recruit, 
    onEdit, 
    onDelete
} : {
    recruit: Recruit, 
    onEdit: (patch: Recruit) => Promise<any>, 
    onDelete: () => Promise<any>
}) => {
    const [editing, setEditing] = useState(false); 
    const [title, setTitle] = useState(recruit.title);
    const [content, setContent] = useState(recruit.content);  
    const [dayAvilable, setDayAvailable] = useState(recruit.dayAvailable); 
    const [tags, setTags] = useState(recruit.tags); 

    return (
        <li>

        </li>
    )
}