import Header from "@/components/Header";
import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Upload,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Loader2,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DiagnosisData } from "@/data/diagnosisData";
import { useDataset } from "@/context/DatasetContext";
import { apiService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const DiagnosisHistory = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewDate, setViewDate] = useState<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [isLoading, setIsLoading] = useState(false);

  // 전역 데이터셋에서 읽기
  const { records, addRecord, clearRecords, setRecords } = useDataset();
  const { toast } = useToast();
  const data: DiagnosisData[] = records;

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 한 페이지에 10개

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = useMemo(
    () => data.slice(startIndex, endIndex),
    [data, startIndex, endIndex]
  );

  // 백엔드에서 진단 기록 가져오기
  const fetchDiagnoses = async (showToast = false) => {
    setIsLoading(true);
    try {
      const result = await apiService.getDiagnoses();

      // 백엔드 데이터를 프론트엔드 형식으로 변환
      const convertedRecords: DiagnosisData[] = result.diagnoses.map(
        (diagnosis) => ({
          image_name: `Image_${diagnosis.diagnosed_at || "Unknown"}`,
          patient_id: result.patient_id,
          sex: "unknown", // 백엔드에서 제공하지 않는 필드
          age_approx: diagnosis.age_approx,
          anatom_site_general_challenge:
            diagnosis.location || diagnosis.anatom_site_general_challenge || "",
          target: diagnosis.benign_malignant === "malignant" ? 1 : 0,
          diagnosis: diagnosis.benign_malignant || "",
          benign_malignant: diagnosis.benign_malignant || "",
          location:
            diagnosis.location || diagnosis.anatom_site_general_challenge || "",
        })
      );

      // 새로고침인 경우 기존 데이터를 초기화하고 새 데이터로 교체
      if (showToast) {
        setRecords(convertedRecords);
      } else {
        // 자동 로드인 경우 기존 데이터에 추가
        convertedRecords.forEach((record) => {
          addRecord(record);
        });
      }

      // 수동 새로고침일 때만 토스트 표시
      if (showToast) {
        toast({
          title: "데이터 로드 완료",
          description: `${convertedRecords.length}개의 진단 기록을 가져왔습니다.`,
        });
      }
    } catch (error) {
      console.error("진단 기록 가져오기 오류:", error);
      toast({
        title: "데이터 로드 실패",
        description: "백엔드에서 진단 기록을 가져오는데 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchDiagnoses();
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const monthLabel = useMemo(
    () =>
      viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    [viewDate]
  );

  const selectedDateLabel = useMemo(
    () =>
      selectedDate.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    [selectedDate]
  );

  const isSameDate = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const calendarCells = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startWeekday = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();
    const cells: { date: Date; inCurrentMonth: boolean }[] = [];
    for (let i = 0; i < 42; i++) {
      const dayOffset = i - startWeekday + 1;
      let cellDate: Date;
      let inCurrentMonth = true;
      if (dayOffset <= 0) {
        cellDate = new Date(year, month - 1, prevMonthDays + dayOffset);
        inCurrentMonth = false;
      } else if (dayOffset > daysInMonth) {
        cellDate = new Date(year, month + 1, dayOffset - daysInMonth);
        inCurrentMonth = false;
      } else {
        cellDate = new Date(year, month, dayOffset);
      }
      cells.push({ date: cellDate, inCurrentMonth });
    }
    return cells;
  }, [viewDate]);
  const calendarDays = [
    [27, 28, 29, 30, 31, 1, 2],
    [3, 4, 5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14, 15, 16],
    [17, 18, 19, 20, 21, 22, 23],
    [24, 25, 26, 27, 28, 29, 30],
    [31, 1, 2, 3, 4, 5, 6],
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">진단 기록</h1>
          <div className="flex items-center gap-2">
            <span className="text-xl text-gray-700">Data Exploration</span>
            <span className="text-gray-400">🔗</span>
          </div>
          <p className="text-gray-500 mt-2">
            진단 기록을 확인하고 데이터를 분석할 수 있습니다
          </p>

          {/* 데이터 새로고침 버튼 */}
          <div className="mt-4">
            <Button
              onClick={() => fetchDiagnoses(true)}
              disabled={isLoading}
              variant="outline"
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  로딩 중...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  데이터 새로고침
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* File Upload */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Choose a file
              </h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium mb-2">
                  Drag and drop file here
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Limit 200MB per file
                </p>
                <Button variant="outline" size="sm">
                  Browse files
                </Button>
              </div>
            </div>

            {/* Calendar */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-medium text-gray-900">날짜 선택</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setViewDate(
                        new Date(
                          viewDate.getFullYear(),
                          viewDate.getMonth() - 1,
                          1
                        )
                      )
                    }
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="font-medium text-gray-900">
                    {monthLabel}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setViewDate(
                        new Date(
                          viewDate.getFullYear(),
                          viewDate.getMonth() + 1,
                          1
                        )
                      )
                    }
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center">
                  {daysOfWeek.map((day) => (
                    <div
                      key={day}
                      className="text-xs text-gray-500 py-2 font-medium"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {calendarCells.map(({ date, inCurrentMonth }, index) => {
                    const selected = isSameDate(date, selectedDate);
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedDate(date)}
                        className={`
                          h-8 text-sm rounded transition-colors
                          ${inCurrentMonth ? "text-gray-900" : "text-gray-400"}
                          ${
                            selected
                              ? "bg-blue-600 text-white"
                              : "hover:bg-gray-100"
                          }
                        `}
                        title={date.toDateString()}
                      >
                        {date.getDate()}
                      </button>
                    );
                  })}
                </div>

                <div className="bg-blue-50 rounded p-3 text-center">
                  <p className="text-blue-700 text-sm font-medium">
                    {selectedDateLabel}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Dataset Table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">
                  Your dataset
                </h3>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-medium text-gray-900 min-w-[120px]">
                        image_name
                      </TableHead>
                      <TableHead className="font-medium text-gray-900 min-w-[100px]">
                        patient_id
                      </TableHead>
                      <TableHead className="font-medium text-gray-900 min-w-[80px]">
                        sex
                      </TableHead>
                      <TableHead className="font-medium text-gray-900 min-w-[100px]">
                        age_approx
                      </TableHead>
                      <TableHead className="font-medium text-gray-900 min-w-[160px]">
                        anatom_site_general_challenge
                      </TableHead>
                      <TableHead className="font-medium text-gray-900 min-w-[80px]">
                        target
                      </TableHead>
                      <TableHead className="font-medium text-gray-900 min-w-[100px]">
                        diagnosis
                      </TableHead>
                      <TableHead className="font-medium text-gray-900 min-w-[130px]">
                        benign_malignant
                      </TableHead>
                      <TableHead className="font-medium text-gray-900 min-w-[120px]">
                        location
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentData.map((item, index) => (
                      <TableRow key={index} className="hover:bg-gray-50">
                        <TableCell className="text-sm text-blue-600 font-mono">
                          {item.image_name}
                        </TableCell>
                        <TableCell className="text-sm">
                          <Link
                            to={`/patient/${item.patient_id}`}
                            className="text-blue-600 font-mono hover:text-blue-800 hover:underline cursor-pointer"
                          >
                            {item.patient_id}
                          </Link>
                        </TableCell>
                        <TableCell className="text-sm">{item.sex}</TableCell>
                        <TableCell className="text-sm">
                          {item.age_approx}
                        </TableCell>
                        <TableCell className="text-sm">
                          {item.anatom_site_general_challenge}
                        </TableCell>
                        <TableCell className="text-sm">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              item.target === 0
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {item.target}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              item.diagnosis === "benign"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {item.diagnosis}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              item.benign_malignant === "benign"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {item.benign_malignant}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm">
                          {item.location}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-8 h-8 rounded text-sm ${
                            currentPage === page
                              ? "bg-blue-600 text-white"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  총 {data.length}개 레코드 | 악성:{" "}
                  {
                    data.filter((i) => i.benign_malignant === "malignant")
                      .length
                  }
                  개 | 양성:{" "}
                  {data.filter((i) => i.benign_malignant === "benign").length}개
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisHistory;
