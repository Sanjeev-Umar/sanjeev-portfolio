import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface Language {
  code: string;
  name: string;
}

interface LanguageSelectorProps {
  languages: Language[];
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  style?: React.CSSProperties;
  className?: string;
}

export function LanguageSelector({
  languages,
  currentLanguage,
  onLanguageChange,
  style,
  className,
}: LanguageSelectorProps) {
  const currentLanguageName = languages.find(
    (lang) => lang.code === currentLanguage
  )?.name;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent",
          className
        )}
        style={style}
        aria-label={`Language: ${currentLanguageName}. Change language`}
      >
        <Globe className="h-4 w-4" aria-hidden="true" />
        <span>{currentLanguageName}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => onLanguageChange(language.code)}
            className="cursor-pointer hover:bg-gray-400"
          >
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
