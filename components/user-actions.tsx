import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface UserActionProps {
  onCopyImage: () => void;
  onGenerateUrl: () => void;
}

export function UserAction({ onCopyImage, onGenerateUrl }: UserActionProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Copy to Clipboard</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Available Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={onCopyImage}>Image</DropdownMenuItem>
          <DropdownMenuItem onClick={onGenerateUrl}>
            Shareable URL
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
