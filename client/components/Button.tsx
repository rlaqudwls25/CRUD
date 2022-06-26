interface Props {
  children: React.ReactNode
  type?: 'submit' | 'button' | 'reset'
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
}
const Button = (props: Props): JSX.Element => {
  const { children, type, className, onClick } = props

  return (
    <>
      <button type={type} className={className} onClick={onClick}>
        {children}
      </button>
    </>
  )
}

export default Button
