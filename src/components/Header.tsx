import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

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
            <Link to="/" className="text-lg font-bold text-foreground">
              KOREN
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-8">
            <Link
              to="/patients"
              className="flex items-center space-x-1 text-sm text-muted-foreground cursor-pointer hover:text-foreground"
            >
              <span>환자 관리</span>
              <ChevronDown className="w-4 h-4" />
            </Link>
            <Link
              to="/diagnosis-history"
              className="flex items-center space-x-1 text-sm text-muted-foreground cursor-pointer hover:text-foreground"
            >
              <span>진단 기록</span>
              <ChevronDown className="w-4 h-4" />
            </Link>
            <Link
              to="/training"
              className="flex items-center space-x-1 text-sm text-muted-foreground cursor-pointer hover:text-foreground"
            >
              <span>모델 학습</span>
              <ChevronDown className="w-4 h-4" />
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
