import React from 'react'
import MsgInput from './MsgInput'
import { User, Mutate } from '../types/types'
import Button from './Button'

const MsgItem = ({
  id,
  timestamp,
  text,
  isEditing,
  onUpdate,
  onDelete,
  startEdit,
  myId,
  user,
}: {
  id: string
  timestamp: number
  text: string
  myId: string | string[]
  user: User
  isEditing: boolean
  onUpdate: Mutate
  onDelete?: () => void
  startEdit: () => void
}) => {
  return (
    <li className="messages__item">
      <h3>
        {user?.nickname}{' '}
        <sub>
          {new Date(timestamp).toLocaleString('ko-KR', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          })}
        </sub>
      </h3>
      {isEditing ? (
        <>{<MsgInput mutate={onUpdate} text={text} id={id} />}</>
      ) : (
        text
      )}
      {myId === user?.id && (
        <div className="messages__buttons">
          <Button className="update" onClick={startEdit}>
            수정
          </Button>
          <Button className="delete" onClick={onDelete}>
            삭제
          </Button>
        </div>
      )}
    </li>
  )
}

export default MsgItem
