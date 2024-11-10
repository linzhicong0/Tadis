import { CustomDialog } from "./custom-dialog"
import { Loader2 } from "lucide-react"

interface LoadingDialogProps {
  open: boolean
  title: string
  description: string
  onClose: () => void
}

export function LoadingDialog({ open, title, description, onClose }: LoadingDialogProps) {
  return (
    <CustomDialog 
      isOpen={open} 
      onClose={onClose}
      title={title}
    >
      <div className="flex items-center gap-3">
        <Loader2 className="h-5 w-5 animate-spin" />
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </CustomDialog>
  )
} 