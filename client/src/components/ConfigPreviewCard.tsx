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
        'transition-colors hover:bg-primary-dark',
        className,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
