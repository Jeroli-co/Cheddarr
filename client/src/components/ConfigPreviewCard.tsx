import { cn } from '../utils/strings'

export const SettingsPreviewCard: React.FC<React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>>> = ({
  onClick,
  className,
  children,
}) => {
  return (
    <button
      type="button"
      className={cn(
        'h-full p-6',
        'border-4 border-primary rounded-lg',
        'transition-colors',
        onClick && 'hover:bg-primary-dark',
        !onClick && 'cursor-default',
        className,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
