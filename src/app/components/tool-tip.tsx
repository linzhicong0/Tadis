import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ToolTipProps {
    children: React.ReactNode;
    tooltipContent: string;
}

export default function ToolTip({ children, tooltipContent }: ToolTipProps) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent>
                    {tooltipContent}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
