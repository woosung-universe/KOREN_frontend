import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { dummyDiagnosisData, DiagnosisData } from "@/data/diagnosisData";
import { useState, useMemo } from "react";

const DiagnosisTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // 페이지당 5개 항목

  // 강제 새로고침을 위한 타임스탬프 추가
  const timestamp = Date.now();
  console.log("컴포넌트 로드 시간:", timestamp);

  const data: DiagnosisData[] = dummyDiagnosisData;

  // 디버깅용 - 데이터가 제대로 로드되는지 확인
  console.log("=== DiagnosisTable 렌더링 ===");
  console.log("데이터 개수:", data.length);
  console.log("첫 번째 환자 ID:", data[0]?.patient_id);
  console.log("첫 번째 환자 나이:", data[0]?.age_approx);
  console.log("현재 페이지:", currentPage);
  console.log("원본 데이터 전체:", JSON.stringify(data, null, 2));

  // 페이지네이션 계산
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = useMemo(() => {
    return data.slice(startIndex, endIndex);
  }, [data, startIndex, endIndex]);

  console.log("현재 페이지 데이터:", currentData);

  const getKoreanLocation = (location: string) => {
    const locationMap: { [key: string]: string } = {
      "head/neck": "머리/목",
      "upper extremity": "상지",
      "lower extremity": "하지",
      torso: "몸통",
    };
    return locationMap[location] || location;
  };

  const getKoreanSex = (sex: string) => {
    return sex === "male" ? "남성" : "여성";
  };

  const getKoreanDiagnosis = (diagnosis: string) => {
    return diagnosis === "benign" ? "양성" : "악성";
  };

  return (
    <div className="bg-white border border-border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="text-center font-medium text-foreground">
              이미지 ID
            </TableHead>
            <TableHead className="text-center font-medium text-foreground">
              환자 ID
            </TableHead>
            <TableHead className="text-center font-medium text-foreground">
              환자 정보
            </TableHead>
            <TableHead className="text-center font-medium text-foreground">
              부위
            </TableHead>
            <TableHead className="text-center font-medium text-foreground">
              진단결과
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentData.map((item, index) => (
            <TableRow key={index} className="hover:bg-muted/30">
              <TableCell className="text-center text-sm">
                {item.image_name}
              </TableCell>
              <TableCell className="text-center text-sm">
                {item.patient_id}
              </TableCell>
              <TableCell className="text-center text-sm">
                {getKoreanSex(item.sex)}, {item.age_approx}세
              </TableCell>
              <TableCell className="text-center text-sm">
                {getKoreanLocation(item.location)}
              </TableCell>
              <TableCell className="text-center text-sm">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    item.benign_malignant === "benign"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {getKoreanDiagnosis(item.benign_malignant)}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-center py-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded text-sm ${
                  currentPage === page
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="ml-4 text-sm text-muted-foreground">
          총 {data.length}개 레코드 | 약성:{" "}
          {data.filter((item) => item.benign_malignant === "benign").length}개 |
          악성:{" "}
          {data.filter((item) => item.benign_malignant === "malignant").length}
          개
        </div>
      </div>
    </div>
  );
};

export default DiagnosisTable;
