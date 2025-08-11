import { Cog, Trash2, Unplug } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ConnectionCardProps {
    name: string;
    address: string;
    status: string;
    onPlay?: () => void;
    onSettings?: () => void;
    onDelete?: () => void;
}

export default function ConnectionCard({ name, address, status, onPlay, onSettings, onDelete }: ConnectionCardProps) {
    const getStatusVariant = (status: string) => {
        switch (status.toUpperCase()) {
            case 'CONNECTED':
                return 'connected'; // We'll override this with custom green styling
            case 'DISCONNECTED':
                return 'disconnected';
            default:
                return 'outline';
        }
    };

    return (
        <Card className="w-[220px] h-[200px] flex flex-col hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-medium truncate pr-2">{name}</CardTitle>
                    <Badge 
                        variant={getStatusVariant(status)} 
                        className={cn("text-xs shrink-0")}
                    >
                        {status}
                    </Badge>
                </div>
                <p className="text-sm text-muted-foreground truncate">{address}</p>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col justify-end pt-0">
                <div className="flex justify-end gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onPlay}
                        className="h-8 w-8 text-muted-foreground hover:text-green-500"
                    >
                        <Unplug className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onSettings}
                        className="h-8 w-8 text-muted-foreground hover:text-blue-500"
                    >
                        <Cog className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onDelete}
                        className="h-8 w-8 text-muted-foreground hover:text-red-500"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}