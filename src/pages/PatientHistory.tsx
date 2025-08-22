import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Calendar,
  User,
  FileText,
  Activity,
  Copy,
  Check,
} from "lucide-react";
import {
  apiService,
  DiagnosisResponse,
  CommunicationSummary,
} from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const PatientHistory = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [diagnosis, setDiagnosis] = useState<DiagnosisResponse | null>(null);
  const [summary, setSummary] = useState<CommunicationSummary | null>(null);
  const [summaryDate, setSummaryDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (patientId) {
      fetchPatientData();
    }
  }, [patientId]);

  const fetchPatientData = async () => {
    if (!patientId) return;

    setIsLoading(true);
    setError("");

    try {
      // 진단 정보와 요약 정보를 동시에 가져오기
      const [diagnosisResult, summaryResult] = await Promise.allSettled([
        apiService.getDiagnosis(patientId),
        apiService.getLatestSummary(patientId),
      ]);

      // 진단 결과 처리
      if (diagnosisResult.status === "fulfilled") {
        setDiagnosis(diagnosisResult.value);
      } else {
        console.error("진단 정보 로드 실패:", diagnosisResult.reason);
      }

      // 요약 결과 처리
      if (summaryResult.status === "fulfilled") {
        setSummary(summaryResult.value.latest_summary);
        setSummaryDate(summaryResult.value.created_at);
      } else {
        console.error("요약 정보 로드 실패:", summaryResult.reason);
      }

      // 모두 실패한 경우에만 에러 표시
      if (
        diagnosisResult.status === "rejected" &&
        summaryResult.status === "rejected"
      ) {
        setError("환자 데이터를 불러오는데 실패했습니다.");
      }
    } catch (error) {
      console.error("환자 데이터 로드 오류:", error);
      setError("환자 데이터를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({
        title: "복사 완료",
        description: "클립보드에 복사되었습니다.",
      });
    } catch (error) {
      toast({
        title: "복사 실패",
        description: "클립보드 복사에 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  const formatSummaryText = () => {
    if (!summary) return "";
    return `[의사 소견]\n${summary.의사_소견}\n\n[환자 우려점]\n${summary.환자의_우려점}\n\n[진료 계획]\n${summary.진료_계획}\n\n[처방]\n${summary.처방}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Activity className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">환자 정보를 불러오는 중...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              이전 화면으로 가기
            </Button>
          </div>

          <div className="flex items-center gap-3 mb-2">
            <User className="h-6 w-6 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">환자 상세 정보</h1>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <span className="text-lg">환자 ID: {patientId}</span>
            <Badge variant="outline" className="ml-2">
              상세 히스토리
            </Badge>
          </div>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">{error}</p>
              <Button
                onClick={fetchPatientData}
                variant="outline"
                size="sm"
                className="mt-4"
              >
                다시 시도
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 진단 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                AI 진단 결과
              </CardTitle>
              <CardDescription>
                의료 이미지 기반 AI 진단 분석 결과
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {diagnosis ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      진단 결과
                    </span>
                    <Badge
                      variant={
                        diagnosis.diagnosis === "malignant"
                          ? "destructive"
                          : "secondary"
                      }
                      className="text-sm"
                    >
                      {diagnosis.diagnosis === "malignant" ? "악성" : "양성"}
                    </Badge>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-600 block mb-1">
                        신뢰도 점수
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${diagnosis.confidence_score * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm text-gray-900 font-medium">
                          {(diagnosis.confidence_score * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-gray-600 block mb-1">
                        의료 이미지 ID
                      </span>
                      <span className="text-sm text-gray-900 font-mono">
                        {diagnosis.medical_image_id}
                      </span>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-gray-600 block mb-1">
                        AI 분석 설명
                      </span>
                      <p className="text-sm text-gray-900 leading-relaxed">
                        {diagnosis.ai_description}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>진단 정보를 불러올 수 없습니다.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 대화 요약 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                최신 진료 요약
              </CardTitle>
              <CardDescription>
                음성 대화 기반 진료 내용 요약
                {summaryDate && (
                  <span className="block text-xs text-gray-500 mt-1">
                    생성일: {new Date(summaryDate).toLocaleString("ko-KR")}
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {summary ? (
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(formatSummaryText())}
                      className="text-xs"
                    >
                      {isCopied ? (
                        <>
                          <Check className="h-3 w-3 mr-1" />
                          복사됨
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3 mr-1" />
                          전체 복사
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-3">
                    <div>
                      <span className="font-semibold text-purple-800 block mb-1">
                        의사 소견
                      </span>
                      <p className="text-purple-700 text-sm leading-relaxed">
                        {summary.의사_소견}
                      </p>
                    </div>

                    <Separator className="border-purple-200" />

                    <div>
                      <span className="font-semibold text-purple-800 block mb-1">
                        환자 우려점
                      </span>
                      <p className="text-purple-700 text-sm leading-relaxed">
                        {summary.환자의_우려점}
                      </p>
                    </div>

                    <Separator className="border-purple-200" />

                    <div>
                      <span className="font-semibold text-purple-800 block mb-1">
                        진료 계획
                      </span>
                      <p className="text-purple-700 text-sm leading-relaxed">
                        {summary.진료_계획}
                      </p>
                    </div>

                    <Separator className="border-purple-200" />

                    <div>
                      <span className="font-semibold text-purple-800 block mb-1">
                        처방
                      </span>
                      <p className="text-purple-700 text-sm leading-relaxed">
                        {summary.처방}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>진료 요약 정보를 불러올 수 없습니다.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 액션 버튼들 */}
        <div className="mt-8 flex justify-center">
          <Button onClick={fetchPatientData} variant="outline">
            <Activity className="h-4 w-4 mr-2" />
            데이터 새로고침
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PatientHistory;
