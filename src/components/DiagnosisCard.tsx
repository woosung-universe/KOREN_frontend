import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "lucide-react";

interface DiagnosisCardProps {
  onDiagnose?: () => void;
  showResult?: boolean;
}

const DiagnosisCard = ({ onDiagnose, showResult }: DiagnosisCardProps) => {
  const [imageUploaded, setImageUploaded] = useState(false);
  const [diagnosisText, setDiagnosisText] = useState("");

  const handleImageUpload = () => {
    setImageUploaded(true);
  };

  return (
    <div className="bg-white border border-border rounded-lg p-8 w-full mx-auto">
      <h2 className="text-xl font-bold text-foreground mb-6">피부암 진단</h2>
      

      <div className="mb-6">
        <label className="text-sm text-muted-foreground mb-2 block">사진을 첨부해주세요</label>
        <div 
          className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50"
          onClick={handleImageUpload}
        >
          {imageUploaded ? (
            <div className="text-sm text-muted-foreground">I939945 진단 이미지</div>
          ) : (
            <div className="text-sm text-muted-foreground">I939945 진단 이미지</div>
          )}
        </div>
      </div>

      {showResult && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-bold text-foreground mb-2">진단 결과,</h3>
          <p className="text-lg font-bold text-foreground">80% 확률로 양성입니다.</p>
          <div className="mt-4">
            <Button variant="outline" size="sm">
              상세 리포트 보러가기 &gt;
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">환자 성명</label>
          <Input placeholder="홍길동" className="border border-border" />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">생년</label>
          <div className="relative">
            <Input placeholder="2003.03.10" className="border border-border" />
            <Calendar className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
          </div>
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">환자 번호</label>
          <Input placeholder="I939945" className="border border-border" />
        </div>
      </div>

      <div className="mb-6">
        <label className="text-sm text-muted-foreground mb-2 block">진단내역</label>
        <Textarea 
          placeholder="내용을 입력하세요"
          className="min-h-24 border border-border"
          value={diagnosisText}
          onChange={(e) => setDiagnosisText(e.target.value)}
        />
        <div className="text-right text-xs text-muted-foreground mt-1">
          <span className="text-blue-600">{diagnosisText.length}</span>/100
        </div>
      </div>

      <div className="text-center">
        <Button 
          onClick={onDiagnose}
          className="px-8"
        >
          {showResult ? "등록하기" : "진단하기"}
        </Button>
      </div>
    </div>
  );
};

export default DiagnosisCard;