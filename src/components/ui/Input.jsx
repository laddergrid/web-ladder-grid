export default function Input({
  label,
  error,
  className = '',
  ...props
}) {
  return (
    <div className={`${className}`}>
      {label && (
        <label className="block text-sm font-medium mb-2 text-slate-300">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-3 bg-white/5 border ${
          error ? 'border-red-500' : 'border-white/10'
        } rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  )
}
