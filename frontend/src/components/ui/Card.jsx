export default function Card({ className = '', children, onClick }) {
  const isClickable = typeof onClick === 'function';

  return (
    <div
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick(e);
              }
            }
          : undefined
      }
      className={[
        'bg-white/80 backdrop-blur-md border border-border rounded-2xl shadow-medium',
        isClickable
          ? 'cursor-pointer transition-transform duration-150 ease-in-out hover:scale-[1.01] hover:shadow-large focus:outline-none focus:ring-2 focus:ring-primary/50'
          : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}
