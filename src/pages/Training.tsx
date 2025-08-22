import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Upload, Play, Info, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";

const Training = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingStatus, setTrainingStatus] = useState<string>("");
  const [trainingError, setTrainingError] = useState<string>("");
  const [trainingCompleted, setTrainingCompleted] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // CSV 파일만 허용
      if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
        toast({
          title: "파일 형식 오류",
          description: "CSV 파일만 업로드 가능합니다.",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      setTrainingError("");
      setTrainingStatus("");
      setTrainingCompleted(false);
    }
  };

  const handleTraining = async () => {
    if (!selectedFile) {
      setTrainingError("파일을 선택해주세요.");
      return;
    }

    setIsTraining(true);
    setTrainingStatus(
      "Federated Learning 네트워크가 1개 서버와 2개 클라이언트로 학습을 시작합니다..."
    );
    setTrainingError("");
    setTrainingCompleted(false);

    try {
      // 실제 구현에서는 여기에 백엔드 API 호출을 추가합니다
      // 예: await fetch('/api/train', { method: 'POST', body: formData })

      // 시뮬레이션을 위한 지연
      await new Promise((resolve) => setTimeout(resolve, 3000));

      setTrainingStatus("학습이 성공적으로 완료되었습니다!");
      setTrainingCompleted(true);

      toast({
        title: "학습 완료",
        description: "모델 학습이 성공적으로 완료되었습니다.",
      });
    } catch (error) {
      setTrainingError(`학습 실행 중 오류가 발생했습니다: ${error}`);
      toast({
        title: "학습 실패",
        description: "모델 학습 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsTraining(false);
    }
  };

  const resetTraining = () => {
    setSelectedFile(null);
    setTrainingStatus("");
    setTrainingError("");
    setTrainingCompleted(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">모델 학습</h1>
          <p className="text-muted-foreground">
            Federated Learning을 사용하여 피부암 진단 모델을 학습시킵니다.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              모델 학습 설정
            </CardTitle>
            <CardDescription>
              학습에 사용할 데이터셋 CSV 파일을 선택하고 학습을 시작하세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="dataset-file">데이터셋 파일 선택 (CSV)</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="dataset-file"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  disabled={isTraining}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isTraining}
                  onClick={() =>
                    document.getElementById("dataset-file")?.click()
                  }
                >
                  <Upload className="h-4 w-4 mr-2" />
                  파일 선택
                </Button>
              </div>
              {selectedFile && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  선택된 파일: {selectedFile.name} (
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              )}
            </div>

            {trainingError && (
              <Alert variant="destructive">
                <AlertDescription>{trainingError}</AlertDescription>
              </Alert>
            )}

            {trainingStatus && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>{trainingStatus}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end gap-2">
              {trainingCompleted && (
                <Button
                  variant="outline"
                  onClick={resetTraining}
                  className="min-w-[120px]"
                >
                  새로 시작
                </Button>
              )}
              <Button
                onClick={handleTraining}
                disabled={!selectedFile || isTraining}
                className="min-w-[120px]"
              >
                {isTraining ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    학습 중...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    학습 시작
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Federated Learning 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>• 1개 중앙 서버와 2개 클라이언트로 구성</p>
                <p>• 데이터는 로컬에 유지되며 개인정보 보호</p>
                <p>• 협력적 학습으로 모델 성능 향상</p>
                <p>• 분산 환경에서 효율적인 학습 진행</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">학습 과정</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>1. 데이터셋 CSV 파일 업로드</p>
                <p>2. 모델 초기화 및 가중치 설정</p>
                <p>3. 클라이언트별 로컬 학습</p>
                <p>4. 서버에서 가중치 집계</p>
                <p>5. 모델 업데이트 및 반복</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {trainingCompleted && (
          <Card className="mt-6 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                학습 완료
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-green-700">
                <p>✅ 모델 학습이 성공적으로 완료되었습니다.</p>
                <p>✅ 새로운 가중치 파일이 생성되었습니다.</p>
                <p>✅ 진단 페이지에서 업데이트된 모델을 사용할 수 있습니다.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Training;
