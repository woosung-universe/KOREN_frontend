import { ChevronDown } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              </div>
            </div>
            <span className="text-lg font-bold text-foreground">KOREN</span>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-8">
            <div className="flex items-center space-x-1 text-sm text-muted-foreground cursor-pointer hover:text-foreground">
              <span>메뉴명</span>
              <ChevronDown className="w-4 h-4" />
            </div>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground cursor-pointer hover:text-foreground">
              <span>메뉴명</span>
              <ChevronDown className="w-4 h-4" />
            </div>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground cursor-pointer hover:text-foreground">
              <span>버튼</span>
              <ChevronDown className="w-4 h-4" />
            </div>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground cursor-pointer hover:text-foreground">
              <span>버튼</span>
              <ChevronDown className="w-4 h-4" />
            </div>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground cursor-pointer hover:text-foreground">
              <span>버튼</span>
              <ChevronDown className="w-4 h-4" />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;