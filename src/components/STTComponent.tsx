import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, MicOff, Loader2, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Web Speech API 타입 정의
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
  onresult:
    | ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void)
    | null;
  onerror:
    | ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void)
    | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}

interface STTComponentProps {
  onSummaryReceived?: (summary: string) => void;
  enableSpeakerIdentification?: boolean; // 화자 식별 활성화 옵션
}

const STTComponent = ({
  onSummaryReceived,
  enableSpeakerIdentification = false,
}: STTComponentProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [speakerTranscripts, setSpeakerTranscripts] = useState<
    Array<{
      speaker: string;
      text: string;
      timestamp: string;
    }>
  >([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  // STT 시작
  const startRecording = () => {
    try {
      // Web Speech API 지원 확인
      if (
        !("webkitSpeechRecognition" in window) &&
        !("SpeechRecognition" in window)
      ) {
        throw new Error("이 브라우저는 음성 인식을 지원하지 않습니다.");
      }

      // SpeechRecognition 객체 생성
      const SpeechRecognitionClass =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognitionClass();

      // 설정
      recognition.lang = "ko-KR"; // 한국어
      recognition.continuous = true; // 연속 인식 활성화 (마이크 켜진 동안 계속 인식)
      recognition.interimResults = false; // 중간 결과 표시 비활성화

      // 이벤트 핸들러
      recognition.onstart = () => {
        setIsRecording(true);
        setTranscript("");
        toast({
          title: "음성 인식 시작",
          description: "마이크를 통해 말씀해주세요.",
        });
      };

      recognition.onresult = (event) => {
        let finalTranscript = "";

        // 모든 결과를 순회하면서 최종 결과만 수집
        for (let i = 0; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          }
        }

        // 최종 결과가 있으면 기존 텍스트에 누적
        if (finalTranscript) {
          setTranscript((prev) => prev + finalTranscript);
        }
      };

      recognition.onerror = (event) => {
        console.error("음성 인식 오류:", event.error);
        setIsRecording(false);
        toast({
          title: "음성 인식 오류",
          description: `오류: ${event.error}`,
          variant: "destructive",
        });
      };

      recognition.onend = () => {
        setIsRecording(false);
        if (transcript.trim()) {
          toast({
            title: "음성 인식 완료",
            description: "음성 인식이 완료되었습니다.",
          });
        }
      };

      // 음성 인식 시작
      recognition.start();
      recognitionRef.current = recognition;
    } catch (error) {
      console.error("음성 인식 초기화 오류:", error);
      toast({
        title: "오류",
        description:
          error instanceof Error
            ? error.message
            : "음성 인식을 시작할 수 없습니다.",
        variant: "destructive",
      });
    }
  };

  // STT 중지
  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  // 요약 요청
  const requestSummary = async () => {
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
      // 요약 API 호출 (백엔드 엔드포인트에 맞게 수정 필요)
      const summaryApiUrl =
        import.meta.env.VITE_SUMMARY_API_URL || "/api/summarize";
      const response = await fetch(summaryApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: transcript }),
      });

      if (!response.ok) {
        throw new Error("요약 처리 중 오류가 발생했습니다.");
      }

      const data = await response.json();
      const summaryText = data.summary || "요약을 생성할 수 없습니다.";
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
                }}
                className="text-xs"
              >
                텍스트 지우기
              </Button>
            )}
          </div>

          {enableSpeakerIdentification && speakerTranscripts.length > 0 ? (
            <div className="space-y-2 max-h-32 overflow-y-auto border rounded-lg p-3">
              {speakerTranscripts.map((item, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <span className="font-medium text-blue-600 min-w-[60px]">
                    {item.speaker}
                  </span>
                  <span className="text-gray-700">{item.text}</span>
                  <span className="text-xs text-gray-500 ml-auto">
                    {item.timestamp}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <Textarea
              placeholder="음성 인식 결과가 여기에 표시됩니다..."
              value={transcript}
              onChange={handleTranscriptChange}
              className="min-h-24"
            />
          )}
        </div>

        {/* 요약 버튼 */}
        <div className="flex justify-center">
          <Button
            onClick={requestSummary}
            disabled={!transcript.trim() || isProcessing}
            className="gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                요약 중...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                요약 생성
              </>
            )}
          </Button>
        </div>

        {/* 요약 결과 */}
        {summary && (
          <div>
            <label className="text-sm font-medium mb-2 block">요약 결과</label>
            <div className="p-4 bg-muted rounded-lg border">
              <p className="text-sm leading-relaxed">{summary}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default STTComponent;
