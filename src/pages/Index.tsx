import { useState } from "react";
import Header from "@/components/Header";
import DiagnosisCard from "@/components/DiagnosisCard";
import DiagnosisCalendar from "@/components/DiagnosisCalendar";
import DiagnosisTable from "@/components/DiagnosisTable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Index = () => {
  const [showResult, setShowResult] = useState(false);

  const handleDiagnose = () => {
    setShowResult(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex justify-end">
          <div className="w-80">
            <label className="text-sm text-muted-foreground mb-2 block">AI 의료 진단 모델</label>
            <Select defaultValue="skin-cancer">
              <SelectTrigger className="border border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="skin-cancer">피부암 진단</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mb-12">
          <DiagnosisCard onDiagnose={handleDiagnose} showResult={showResult} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <DiagnosisCalendar />
          </div>
          <div className="lg:col-span-2">
            <DiagnosisTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
