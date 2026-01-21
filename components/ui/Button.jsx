export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
  ...props
}) {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-200 inline-flex items-center justify-center'

  const variants = {
    primary: 'bg-gradient-to-r from-brand-purple to-brand-blue hover:shadow-lg hover:shadow-brand-purple/50 text-white',
    secondary: 'border-2 border-brand-purple hover:bg-brand-purple/10 text-brand-purple',
    ghost: 'hover:bg-white/5 text-slate-300 hover:text-white'
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
