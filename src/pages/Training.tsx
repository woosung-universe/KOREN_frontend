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
import { Loader2, Upload, Play, Info } from "lucide-react";
import Header from "@/components/Header";

const Training = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingStatus, setTrainingStatus] = useState<string>("");
  const [trainingError, setTrainingError] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setTrainingError("");
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

    try {
      // 실제 구현에서는 여기에 백엔드 API 호출을 추가합니다
      // 예: await fetch('/api/train', { method: 'POST', body: formData })

      // 시뮬레이션을 위한 지연
      await new Promise((resolve) => setTimeout(resolve, 3000));

      setTrainingStatus("학습이 성공적으로 완료되었습니다!");
    } catch (error) {
      setTrainingError(`학습 실행 중 오류가 발생했습니다: ${error}`);
    } finally {
      setIsTraining(false);
    }
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
              학습에 사용할 데이터셋 파일을 선택하고 학습을 시작하세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="dataset-file">데이터셋 파일 선택</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="dataset-file"
                  type="file"
                  accept=".csv,.xlsx,.json"
                  onChange={handleFileChange}
                  disabled={isTraining}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!selectedFile || isTraining}
                  onClick={() =>
                    document.getElementById("dataset-file")?.click()
                  }
                >
                  <Upload className="h-4 w-4 mr-2" />
                  파일 선택
                </Button>
              </div>
              {selectedFile && (
                <p className="text-sm text-muted-foreground">
                  선택된 파일: {selectedFile.name}
                </p>
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

            <div className="flex justify-end">
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
      </div>
    </div>
  );
};

export default Training;
