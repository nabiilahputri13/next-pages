type ButtonWhiteProps = {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

export default function ButtonWhite({ children, onClick, className }: ButtonWhiteProps) {
  return (
    <button
      onClick={onClick}
      className={`bg-white border border-black text px-6 py-2 hover:bg-black hover:border hover:text-white transition ${className || ''}`}
    >
      {children}
    </button>
  )
}