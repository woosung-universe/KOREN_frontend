import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mic, MicOff, FileText, Copy, Check } from "lucide-react";
import {
  apiService,
  ConversationInput,
  CommunicationSummary,
} from "@/services/api";

// Web Speech API 타입 정의
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult:
    | ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void)
    | null;
  onerror:
    | ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void)
    | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

// Window 인터페이스 확장
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface STTComponentProps {
  onSummaryReceived?: (summary: string) => void;
  patientId?: string;
}

const STTComponent = ({
  onSummaryReceived,
  patientId = "default_patient",
}: STTComponentProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [speakerTranscripts, setSpeakerTranscripts] = useState<string[]>([]);
  const [summary, setSummary] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [summaryData, setSummaryData] = useState<CommunicationSummary | null>(
    null
  );

  const { toast } = useToast();
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Web Speech API 지원 확인
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = "ko-KR";

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          let finalTranscript = "";
          let interimTranscript = "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          if (finalTranscript) {
            setTranscript((prev) => prev + finalTranscript);
            setSpeakerTranscripts((prev) => [...prev, finalTranscript]);
          }
        };

        recognitionRef.current.onerror = (
          event: SpeechRecognitionErrorEvent
        ) => {
          console.error("음성 인식 오류:", event.error);
          toast({
            title: "음성 인식 오류",
            description: `오류: ${event.error}`,
            variant: "destructive",
          });
          setIsRecording(false);
        };

        recognitionRef.current.onend = () => {
          setIsRecording(false);
        };
      }
    }
  }, [toast]);

  const startRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsRecording(true);
      toast({
        title: "음성 인식 시작",
        description: "마이크를 통해 음성을 인식하고 있습니다.",
      });
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      toast({
        title: "음성 인식 종료",
        description: "음성 인식이 종료되었습니다.",
      });
    }
  };

  const handleCreateSummary = async () => {
    if (!transcript.trim()) {
      toast({
        title: "경고",
        description: "요약할 텍스트가 없습니다.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const inputData: ConversationInput = {
        patient_id: patientId,
        conversation: transcript,
      };

      const summaryResult = await apiService.createSummary(inputData);
      setSummaryData(summaryResult);

      // 요약 텍스트를 JSON 형태로 포맷팅
      const summaryText = JSON.stringify(summaryResult, null, 2);
      setSummary(summaryText);

      // 부모 컴포넌트에 요약 전달
      onSummaryReceived?.(summaryText);

      toast({
        title: "요약 완료",
        description: "텍스트 요약이 완료되었습니다.",
      });
    } catch (error) {
      console.error("요약 오류:", error);
      toast({
        title: "요약 오류",
        description: "요약 생성 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      toast({
        title: "복사 완료",
        description: "클립보드에 복사되었습니다.",
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast({
        title: "복사 실패",
        description: "클립보드 복사에 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  // 텍스트 직접 입력 처리
  const handleTranscriptChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setTranscript(e.target.value);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Mic className="h-4 w-4" />
          음성 인식
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 녹음 컨트롤 */}
        <div className="flex justify-center">
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            variant={isRecording ? "destructive" : "default"}
            size="lg"
            className="w-20 h-20 rounded-full"
          >
            {isRecording ? (
              <MicOff className="h-8 w-8" />
            ) : (
              <Mic className="h-8 w-8" />
            )}
          </Button>
        </div>

        {/* 상태 표시 */}
        <div className="text-center text-sm text-muted-foreground">
          {isRecording &&
            "음성 인식 중... 말씀이 끝나면 종료 버튼을 눌러주세요"}
          {!isRecording && "마이크 버튼을 눌러 음성 인식을 시작하세요"}
        </div>

        {/* STT 결과 */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">음성 인식 결과</label>
            {transcript && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setTranscript("");
                  setSpeakerTranscripts([]);
                  setSummary("");
                  setSummaryData(null);
                }}
                className="text-xs"
              >
                초기화
              </Button>
            )}
          </div>
          <Textarea
            value={transcript}
            onChange={handleTranscriptChange}
            placeholder="음성 인식 결과가 여기에 표시됩니다..."
            className="min-h-[100px] resize-none"
            disabled={isRecording}
          />
        </div>

        {/* 요약 생성 버튼 */}
        {transcript && (
          <div className="flex justify-center">
            <Button
              onClick={handleCreateSummary}
              disabled={isProcessing || !transcript.trim()}
              className="flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  요약 생성 중...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  요약 생성하기
                </>
              )}
            </Button>
          </div>
        )}

        {/* 요약 결과 표시 */}
        {summary && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium text-purple-700">요약 결과</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(summary)}
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
                    복사
                  </>
                )}
              </Button>
            </div>

            {/* 보라색 박스로 요약 결과 표시 */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              {summaryData ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-purple-800 min-w-[80px]">
                        의사 소견:
                      </span>
                      <span className="text-purple-700">
                        {summaryData.의사_소견}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-purple-800 min-w-[80px]">
                        환자 우려점:
                      </span>
                      <span className="text-purple-700">
                        {summaryData.환자의_우려점}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-purple-800 min-w-[80px]">
                        진료 계획:
                      </span>
                      <span className="text-purple-700">
                        {summaryData.진료_계획}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-purple-800 min-w-[80px]">
                        처방:
                      </span>
                      <span className="text-purple-700">
                        {summaryData.처방}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <pre className="text-sm text-purple-700 whitespace-pre-wrap">
                  {summary}
                </pre>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default STTComponent;
