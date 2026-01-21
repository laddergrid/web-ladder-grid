export default function Card({ icon, title, description, className = '' }) {
  return (
    <div className={`glass-card p-6 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-purple/20 ${className}`}>
      {icon && (
        <div className="mb-4 w-12 h-12 rounded-lg bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center">
          {icon}
        </div>
      )}
      {title && <h3 className="text-xl font-bold mb-2">{title}</h3>}
      {description && <p className="text-slate-300 leading-relaxed">{description}</p>}
    </div>
  )
}
