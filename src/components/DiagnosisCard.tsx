import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";
import { useDataset } from "@/context/DatasetContext";
import type { DiagnosisData } from "@/data/diagnosisData";

interface DiagnosisCardProps {
  onDiagnose?: () => void;
  showResult?: boolean;
}

const DiagnosisCard = ({ onDiagnose, showResult }: DiagnosisCardProps) => {
  const { addRecord } = useDataset();
  const [imageUploaded, setImageUploaded] = useState(false);
  const [diagnosisText, setDiagnosisText] = useState("");
  const [sex, setSex] = useState("");
  const [anatomSite, setAnatomSite] = useState("");
  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState<string>("");
  const [patientId, setPatientId] = useState("");

  const handleImageUpload = () => {
    setImageUploaded(true);
  };

  const handleSubmit = () => {
    const ageNum = Number(age);
    const newRecord: DiagnosisData = {
      image_name: "", // 사진은 추후 업로드 연동 예정
      patient_id: patientId || "",
      sex: sex || "",
      age_approx: isNaN(ageNum) ? 0 : ageNum,
      anatom_site_general_challenge: anatomSite || "",
      target: 0, // 모델 채우는 값은 비워둠(0)
      diagnosis: "", // 모델 결과 비움
      benign_malignant: "", // 모델 결과 비움
      location: anatomSite || "",
    };
    addRecord(newRecord);
    onDiagnose?.();
  };

  return (
    <div className="bg-white border border-border rounded-lg p-12 w-full mx-auto min-h-[600px]">
      <h2 className="text-xl font-bold text-foreground mb-8">피부암 진단</h2>
      

      <div className="mb-8">
        <label className="text-sm text-muted-foreground mb-4 block">사진을 첨부해주세요</label>
        <div 
          className="border-2 border-dashed border-border rounded-lg p-16 text-center cursor-pointer hover:bg-muted/50 min-h-[200px] flex items-center justify-center"
          onClick={handleImageUpload}
        >
          {imageUploaded ? (
            <div className="text-sm text-muted-foreground">이미지 업로드됨</div>
          ) : (
            <div className="text-sm text-muted-foreground">이미지 선택</div>
          )}
        </div>
      </div>

      {showResult && (
        <div className="mb-8 p-6 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-bold text-foreground mb-2">진단 결과,</h3>
          <p className="text-lg font-bold text-foreground">예시 결과(모델 연동 전)</p>
          <div className="mt-4">
            <Button variant="outline" size="sm">
              상세 리포트 보러가기 &gt;
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="text-sm text-muted-foreground mb-3 block">환자 성명</label>
          <Input placeholder="홍길동" className="border border-border h-12" value={patientName} onChange={e => setPatientName(e.target.value)} />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-3 block">나이</label>
          <Input placeholder="45" type="number" className="border border-border h-12" value={age} onChange={e => setAge(e.target.value)} />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-3 block">환자 번호</label>
          <Input placeholder="IP_7279968" className="border border-border h-12" value={patientId} onChange={e => setPatientId(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="text-sm text-muted-foreground mb-3 block">성별</label>
          <RadioGroup value={sex} onValueChange={setSex} className="flex space-x-6">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male" className="text-sm">남성</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female" className="text-sm">여성</Label>
            </div>
          </RadioGroup>
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-3 block">병변 부위</label>
          <Select value={anatomSite} onValueChange={setAnatomSite}>
            <SelectTrigger className="border border-border h-12">
              <SelectValue placeholder="부위를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="head/neck">머리/목</SelectItem>
              <SelectItem value="upper extremity">상지 (팔)</SelectItem>
              <SelectItem value="lower extremity">하지 (다리)</SelectItem>
              <SelectItem value="torso">몸통</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mb-10">
        <label className="text-sm text-muted-foreground mb-3 block">진단 메모 (선택사항)</label>
        <Textarea 
          placeholder="추가 관찰 사항이나 메모를 입력하세요"
          className="min-h-32 border border-border"
          value={diagnosisText}
          onChange={(e) => setDiagnosisText(e.target.value)}
        />
        <div className="text-right text-xs text-muted-foreground mt-2">
          <span className="text-blue-600">{diagnosisText.length}</span>/200
        </div>
      </div>

      <div className="text-center pt-4">
        <Button 
          onClick={handleSubmit}
          className="px-12 py-3 text-base"
        >
          {showResult ? "등록하기" : "진단하기"}
        </Button>
      </div>
    </div>
  );
};

export default DiagnosisCard;