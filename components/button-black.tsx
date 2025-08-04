type ButtonBlackProps = {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit' | 'reset' // tambahkan ini
}

export default function ButtonBlack({ children, onClick, className, type = 'button' }: ButtonBlackProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-black border border-black text-white px-6 py-2 hover:bg-white hover:border hover:text-black transition ${className || ''}`}
    >
      {children}
    </button>
  )
}
