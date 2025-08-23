import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Calendar, Upload, X, Loader2, User, FileText } from "lucide-react";
import { useDataset } from "@/context/DatasetContext";
import type { DiagnosisData } from "@/data/diagnosisData";
import STTComponent from "./STTComponent";
import {
  apiService,
  DiagnosisRequest,
  DiagnosisResponse,
  CommunicationSummary,
} from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface DiagnosisCardProps {
  onDiagnose?: () => void;
  showResult?: boolean;
}

const DiagnosisCard = ({ onDiagnose, showResult }: DiagnosisCardProps) => {
  const { addRecord } = useDataset();
  const { toast } = useToast();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [diagnosisText, setDiagnosisText] = useState("");
  const [sex, setSex] = useState("");
  const [anatomSite, setAnatomSite] = useState("");
  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState<string>("");
  const [patientId, setPatientId] = useState("");
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] =
    useState<DiagnosisResponse | null>(null);

  // 기존 환자 데이터 상태 추가
  const [existingDiagnosis, setExistingDiagnosis] =
    useState<DiagnosisResponse | null>(null);
  const [existingSummary, setExistingSummary] =
    useState<CommunicationSummary | null>(null);
  const [isLoadingPatientData, setIsLoadingPatientData] = useState(false);
  const [hasExistingData, setHasExistingData] = useState(false);

  // STT 요약 결과 상태 추가
  const [sttSummary, setSttSummary] = useState<string>("");

  // 환자 정보 입력 완료 여부 확인
  const isPatientInfoComplete = patientName && age && sex && patientId;

  // 환자 정보가 완료되면 기존 데이터 자동 조회
  useEffect(() => {
    if (isPatientInfoComplete && patientId) {
      fetchExistingPatientData();
    } else {
      // 환자 정보가 불완전하면 기존 데이터 초기화
      setExistingDiagnosis(null);
      setExistingSummary(null);
      setHasExistingData(false);
    }
  }, [patientName, age, sex, patientId]);

  // 기존 환자 데이터 조회
  const fetchExistingPatientData = async () => {
    if (!patientId) return;

    setIsLoadingPatientData(true);
    try {
      const [diagnosisResult, summaryResult] = await Promise.allSettled([
        apiService.getDiagnosis(patientId),
        apiService.getLatestSummary(patientId),
      ]);

      let hasData = false;

      // 진단 결과 처리
      if (diagnosisResult.status === "fulfilled") {
        setExistingDiagnosis(diagnosisResult.value);
        hasData = true;
      }

      // 요약 결과 처리
      if (summaryResult.status === "fulfilled") {
        setExistingSummary(summaryResult.value.latest_summary);
        hasData = true;
      }

      setHasExistingData(hasData);

      if (hasData) {
        toast({
          title: "기존 환자 데이터 로드 완료",
          description: "이전 진단 결과와 대화 요약을 불러왔습니다.",
        });
      }
    } catch (error) {
      console.error("기존 환자 데이터 조회 오류:", error);
      // 오류가 발생해도 계속 진행 (새 환자일 수 있음)
    } finally {
      setIsLoadingPatientData(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    setDiagnosisResult(null);
  };

  const handleSubmit = async () => {
    if (!imageFile) {
      toast({
        title: "이미지 필요",
        description: "진단을 위해 이미지를 업로드해주세요.",
        variant: "destructive",
      });
      return;
    }

    if (!patientName || !age || !sex || !anatomSite || !patientId) {
      toast({
        title: "정보 누락",
        description: "모든 환자 정보를 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    setIsDiagnosing(true);
    try {
      const requestData: DiagnosisRequest = {
        file: imageFile,
        patient_name: patientName,
        patient_age: Number(age),
        patient_id: patientId,
        patient_sex: sex,
        anatomy_site: anatomSite,
      };

      const result = await apiService.diagnose(requestData);
      setDiagnosisResult(result);

      // 로컬 상태에 기록 추가
      const ageNum = Number(age);
      const newRecord: DiagnosisData = {
        image_name: imageFile.name,
        patient_id: patientId,
        sex: sex,
        age_approx: isNaN(ageNum) ? 0 : ageNum,
        anatom_site_general_challenge: anatomSite,
        target: result.diagnosis === "malignant" ? 1 : 0,
        diagnosis: result.diagnosis,
        benign_malignant: result.diagnosis,
        location: anatomSite,
      };
      addRecord(newRecord);

      onDiagnose?.();

      toast({
        title: "진단 완료",
        description: "AI 진단이 완료되었습니다.",
      });
    } catch (error) {
      console.error("진단 오류:", error);
      toast({
        title: "진단 실패",
        description: "진단 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsDiagnosing(false);
    }
  };

  return (
    <div className="bg-white border border-border rounded-lg p-12 w-full mx-auto min-h-[600px]">
      <h2 className="text-xl font-bold text-foreground mb-8">피부암 진단</h2>

      {/* 환자 정보 입력 안내 */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center space-x-2 text-blue-700">
          <User className="h-5 w-5" />
          <span className="text-sm font-medium">
            환자 정보를 먼저 입력해주세요. 기존 환자라면 자동으로 이전 데이터를
            불러옵니다.
          </span>
        </div>
      </div>

      {/* 환자 정보 입력 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="text-sm text-muted-foreground mb-3 block">
            환자 성명
          </label>
          <Input
            placeholder="홍길동"
            className="border border-border h-12"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            disabled={isLoadingPatientData || hasExistingData}
          />
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-3 block">
            나이
          </label>
          <Input
            placeholder="45"
            type="number"
            className="border border-border h-12"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            disabled={isLoadingPatientData || hasExistingData}
          />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-3 block">
            환자 번호
          </label>
          <Input
            placeholder="IP_7279968"
            className="border border-border h-12"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            disabled={isLoadingPatientData || hasExistingData}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="text-sm text-muted-foreground mb-3 block">
            성별
          </label>
          <RadioGroup
            value={sex}
            onValueChange={setSex}
            className="flex space-x-6"
            disabled={isLoadingPatientData || hasExistingData}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male" className="text-sm">
                남성
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female" className="text-sm">
                여성
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-3 block">
            &nbsp;
          </label>
          <div className="h-12 flex items-center text-sm text-muted-foreground">
            환자 기본 정보
          </div>
        </div>
      </div>

      {/* 기존 환자 데이터 표시 */}
      {isLoadingPatientData && (
        <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2 text-blue-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">기존 환자 데이터를 불러오는 중...</span>
          </div>
        </div>
      )}

      {hasExistingData && (
        <div className="mb-8 p-6 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center space-x-2 mb-4">
            <User className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-green-800">
              기존 환자 데이터
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 기존 진단 결과 */}
            {existingDiagnosis && (
              <div className="p-4 bg-white rounded-lg border border-green-200">
                <div className="flex items-center space-x-2 mb-3">
                  <FileText className="h-4 w-4 text-green-600" />
                  <h4 className="font-medium text-green-800">이전 진단 결과</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">진단:</span>{" "}
                    <span
                      className={
                        existingDiagnosis.diagnosis === "malignant"
                          ? "text-red-600 font-semibold"
                          : "text-green-600 font-semibold"
                      }
                    >
                      {existingDiagnosis.diagnosis === "malignant"
                        ? "악성"
                        : "양성"}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">신뢰도:</span>{" "}
                    {(existingDiagnosis.confidence_score * 100).toFixed(1)}%
                  </p>
                  <p>
                    <span className="font-medium">AI 설명:</span>{" "}
                    <span className="text-gray-600">
                      {existingDiagnosis.ai_description}
                    </span>
                  </p>
                </div>
              </div>
            )}

            {/* 기존 대화 요약 */}
            {existingSummary && (
              <div className="p-4 bg-white rounded-lg border border-green-200">
                <div className="flex items-center space-x-2 mb-3">
                  <FileText className="h-4 w-4 text-green-600" />
                  <h4 className="font-medium text-green-800">이전 대화 요약</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">의사 소견:</span>{" "}
                    <span className="text-gray-600">
                      {existingSummary["의사 소견"]}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">환자 우려점:</span>{" "}
                    <span className="text-gray-600">
                      {existingSummary["환자의 우려점"]}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">진료 계획:</span>{" "}
                    <span className="text-gray-600">
                      {existingSummary["진료 계획"]}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">처방:</span>{" "}
                    <span className="text-gray-600">
                      {existingSummary["처방"]}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 p-3 bg-green-100 rounded-lg">
            <p className="text-sm text-green-700">
              💡 기존 환자 데이터가 로드되었습니다. 이전 진단 결과와 대화 요약을
              참고하여 새로운 진단을 진행하세요.
            </p>
          </div>
        </div>
      )}

      {/* 병변 부위 선택 */}
      <div className="mb-8">
        <label className="text-sm text-muted-foreground mb-3 block">
          병변 부위
        </label>
        <Select
          value={anatomSite}
          onValueChange={setAnatomSite}
          disabled={!isPatientInfoComplete}
        >
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
        {!isPatientInfoComplete && (
          <p className="text-xs text-muted-foreground mt-2">
            환자 정보를 먼저 입력해주세요
          </p>
        )}
      </div>

      {/* 이미지 업로드 */}
      <div className="mb-8">
        <label className="text-sm text-muted-foreground mb-4 block">
          사진을 첨부해주세요
        </label>
        <div className="space-y-4">
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="업로드된 이미지"
                className="w-full max-w-md h-48 object-cover rounded-lg border"
              />
              <Button
                variant="destructive"
                size="sm"
                onClick={removeImage}
                className="absolute top-2 right-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div
              className={`border-2 border-dashed rounded-lg p-16 text-center min-h-[200px] flex flex-col items-center justify-center ${
                isPatientInfoComplete
                  ? "border-border cursor-pointer hover:bg-muted/50"
                  : "border-gray-300 bg-gray-50 cursor-not-allowed"
              }`}
            >
              <Upload
                className={`h-8 w-8 mb-2 ${
                  isPatientInfoComplete
                    ? "text-muted-foreground"
                    : "text-gray-400"
                }`}
              />
              <div
                className={`text-sm mb-2 ${
                  isPatientInfoComplete
                    ? "text-muted-foreground"
                    : "text-gray-400"
                }`}
              >
                {isPatientInfoComplete
                  ? "이미지 선택"
                  : "환자 정보를 먼저 입력해주세요"}
              </div>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                disabled={!isPatientInfoComplete}
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById("image-upload")?.click()}
                disabled={!isPatientInfoComplete}
              >
                이미지 업로드
              </Button>
            </div>
          )}
        </div>
      </div>

      {diagnosisResult && (
        <div className="mb-8 p-6 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-bold text-foreground mb-2">진단 결과</h3>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">진단:</span>{" "}
              <span
                className={
                  diagnosisResult.diagnosis === "malignant"
                    ? "text-red-600 font-semibold"
                    : "text-green-600 font-semibold"
                }
              >
                {diagnosisResult.diagnosis === "malignant"
                  ? "악성 (Melanoma)"
                  : "양성"}
              </span>
            </p>
            <p className="text-sm">
              <span className="font-medium">신뢰도:</span>{" "}
              {(diagnosisResult.confidence_score * 100).toFixed(1)}%
            </p>
            <p className="text-sm">
              <span className="font-medium">AI 설명:</span>{" "}
              {diagnosisResult.ai_description}
            </p>
          </div>
          <div className="mt-4">
            <Button variant="outline" size="sm">
              상세 리포트 보러가기 &gt;
            </Button>
          </div>
        </div>
      )}

      <div className="mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 진단 메모 */}
          <div>
            <label className="text-sm text-muted-foreground mb-3 block">
              진단 메모 (선택사항)
            </label>
            <Textarea
                maxLength={200}
                placeholder={
                isPatientInfoComplete
                  ? "추가 관찰 사항이나 메모를 입력하세요"
                  : "환자 정보를 먼저 입력해주세요"
              }
              className={`min-h-32 border border-border ${
                isPatientInfoComplete ? "" : "bg-gray-50 text-gray-400"
              }`}
              value={diagnosisText}
              onChange={(e) => setDiagnosisText(e.target.value)}
              disabled={!isPatientInfoComplete}
            />
            <div className="text-right text-xs text-muted-foreground mt-2">
              <span className="text-blue-600">{diagnosisText.length}</span>/500
            </div>
          </div>

          {/* STT 컴포넌트 */}
          <div>
            <label className="text-sm text-muted-foreground mb-3 block">
              음성 요약 (선택사항)
            </label>
            {patientId ? (
              <div>
                <STTComponent
                  onSummaryReceived={(summary) => {
                    // 요약 결과를 상태에 저장
                    setSttSummary(summary);
                  }}
                  patientId={patientId}
                />
                {/* 요약 결과 표시 및 추가 버튼 */}
                {sttSummary && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-sm text-blue-800 mb-2">
                      <strong>음성 요약 결과:</strong>
                    </div>
                    <div className="text-xs text-blue-700 mb-3 bg-white p-2 rounded border">
                      {sttSummary}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // 사용자가 직접 진단 메모에 추가
                        const summaryText = `[음성 요약] ${sttSummary}`;
                        setDiagnosisText((prev) => {
                          const newText =
                            prev + (prev ? "\n\n" : "") + summaryText;
                          return newText.length > 200
                            ? newText.substring(0, 200)
                            : newText;
                        });
                        // 추가 후 요약 결과 초기화
                        setSttSummary("");
                      }}
                      className="w-full text-xs"
                    >
                      진단 메모에 추가
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 min-h-32 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center mx-auto mb-2">
                    <span className="text-xs text-white">🔒</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    환자 번호를 입력하면
                    <br />
                    음성 요약 기능을 사용할 수 있습니다
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 진단하기 버튼 */}
      <div className="flex justify-center mb-8">
        <Button
          onClick={handleSubmit}
          disabled={isDiagnosing || !imageFile || !isPatientInfoComplete}
          className="px-12 py-3 text-base"
        >
          {isDiagnosing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              진단 중...
            </>
          ) : (
            "진단하기"
          )}
        </Button>
      </div>
    </div>
  );
};

export default DiagnosisCard;
