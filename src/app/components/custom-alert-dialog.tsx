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
      <AlertDialogContent className="border-none bg-white dark:bg-dialog-default">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-gray-900 dark:text-white">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-base text-gray-600 dark:text-gray-300">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="bg-gray-100 hover:bg-gray-200 dark:bg-[#2c2c2c] dark:hover:bg-[#3c3c3c] text-gray-900 dark:text-white px-4 border-none"
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
