import React, { FormEvent, useRef } from 'react'
import Button from './button'

const MsgInput = ({
  mutate,
  id = undefined,
  text,
}: {
  mutate: (text: string, id?: string) => void
  id?: string
  text?: string
}) => {
  const textRef = useRef<HTMLTextAreaElement>(null)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!textRef.current) return
    const text = textRef.current.value

    textRef.current.value = ''
    mutate(text, id)
  }

  return (
    <form className="messages__input" onSubmit={onSubmit}>
      <textarea ref={textRef} defaultValue={text} />
      <Button type="submit">등록</Button>
    </form>
  )
}

export default MsgInput
