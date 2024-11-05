import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CustomAlertDialogProps {
  open: boolean;
  title: string;
  description: string;
  onCancel: () => void;
  onContinue: () => void;
}

export default function CustomAlertDialog({
  open,
  title,
  description,
  onCancel,
  onContinue,
}: CustomAlertDialogProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="border-none bg-dialog-default">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="bg-[#2c2c2c] hover:bg-[#3c3c3c] text-white px-4"
            onClick={onCancel}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-blue-600 hover:bg-blue-700 text-white px-4"
            onClick={onContinue}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
