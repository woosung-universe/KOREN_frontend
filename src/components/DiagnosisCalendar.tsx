import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DiagnosisCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState("2024년 12월");
  
  const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
  const calendarDays = [
    [26, 27, 28, 29, 30, 1, 2],
    [3, 4, 5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14, 15, 16],
    [17, 18, 19, 20, 21, 22, 23],
    [24, 25, 26, 27, 28, 29, 30],
    [31, 1, 2, 3, 4, 5, 6]
  ];

  return (
    <div className="bg-white border border-border rounded-lg p-4 w-80">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="sm">
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="flex items-center space-x-2">
          <span className="font-medium">{currentMonth}</span>
        </div>
        <Button variant="ghost" size="sm">
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center text-xs text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.flat().map((day, index) => {
          const isCurrentMonth = day <= 31 && day >= 1;
          const isSelected = day === 12;
          
          return (
            <button
              key={index}
              className={`
                h-8 text-sm rounded hover:bg-muted transition-colors
                ${isCurrentMonth ? "text-foreground" : "text-muted-foreground"}
                ${isSelected ? "bg-primary text-primary-foreground" : ""}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>

      <div className="flex justify-between mt-4">
        <Button variant="outline" size="sm">취소</Button>
        <Button size="sm">선택</Button>
      </div>
    </div>
  );
};

export default DiagnosisCalendar;