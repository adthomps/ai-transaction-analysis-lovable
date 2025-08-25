import { ThemeToggle } from "@/components/theme-toggle";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg sm:text-xl font-bold text-foreground truncate">
            AI Transaction Analyzer
          </h1>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};