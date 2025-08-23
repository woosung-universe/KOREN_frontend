import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  User,
  Users,
  Activity,
  Calendar,
  FileText,
  RefreshCw,
  Loader2,
  ChevronRight,
  Filter,
} from "lucide-react";
import { apiService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface PatientInfo {
  patient_id: string;
  patient_name: string;
  age_approx: number;
  location?: string;
  anatom_site_general_challenge?: string;
  benign_malignant?: string;
  diagnosed_at?: string;
  confidence_score?: number;
}

const PatientManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState<PatientInfo[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<PatientInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const { toast } = useToast();

  // 페이지 로드 시 환자 데이터 가져오기
  useEffect(() => {
    fetchPatients();
  }, []);

  // 검색어 또는 필터 변경 시 환자 목록 필터링
  useEffect(() => {
    filterPatients();
  }, [searchQuery, selectedFilter, patients]);

  // 환자 데이터 가져오기
  const fetchPatients = async () => {
    setIsLoading(true);
    try {
      const result = await apiService.getDiagnoses();

      // Mock API에서 반환하는 데이터를 환자별로 분리
      // 각 진단 데이터를 고유한 환자로 처리
      const patientsList: PatientInfo[] = result.diagnoses.map(
        (diagnosis, index) => ({
          patient_id: `${result.patient_id}_${index + 1}`, // 고유한 환자 ID 생성
          patient_name: `${result.patient_name} ${index + 1}`, // 고유한 환자 이름 생성
          age_approx: diagnosis.age_approx + index * 2, // 나이에 약간의 차이
          location: diagnosis.location,
          anatom_site_general_challenge:
            diagnosis.anatom_site_general_challenge,
          benign_malignant: diagnosis.benign_malignant,
          diagnosed_at: diagnosis.diagnosed_at,
          confidence_score: diagnosis.confidence_score,
        })
      );

      setPatients(patientsList);
    } catch (error) {
      console.error("환자 데이터 로드 오류:", error);
      toast({
        title: "데이터 로드 실패",
        description: "환자 데이터를 불러오는데 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 환자 목록 필터링
  const filterPatients = () => {
    let filtered = patients;

    // 검색어로 필터링
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (patient) =>
          patient.patient_id.toLowerCase().includes(query) ||
          patient.patient_name.toLowerCase().includes(query) ||
          patient.location?.toLowerCase().includes(query) ||
          patient.anatom_site_general_challenge?.toLowerCase().includes(query)
      );
    }

    // 진단 결과로 필터링
    if (selectedFilter !== "all") {
      filtered = filtered.filter(
        (patient) => patient.benign_malignant === selectedFilter
      );
    }

    setFilteredPatients(filtered);
  };

  // 검색 입력 처리
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // 필터 변경 처리
  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
  };

  // 통계 계산
  const totalPatients = patients.length;
  const malignantCount = patients.filter(
    (p) => p.benign_malignant === "malignant"
  ).length;
  const benignCount = patients.filter(
    (p) => p.benign_malignant === "benign"
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 헤더 섹션 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">환자 관리</h1>
          </div>
          <p className="text-gray-600 text-lg">
            환자 정보를 검색하고 관리할 수 있습니다
          </p>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <User className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">전체 환자</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalPatients}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Activity className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-sm text-gray-600">악성 진단</p>
                  <p className="text-2xl font-bold text-red-600">
                    {malignantCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Activity className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">양성 진단</p>
                  <p className="text-2xl font-bold text-green-600">
                    {benignCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">최근 진단</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {patients.length > 0 ? "오늘" : "-"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 검색 및 필터 섹션 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              환자 검색 및 필터링
            </CardTitle>
            <CardDescription>
              환자 ID, 이름, 진단 부위로 검색하거나 진단 결과로 필터링할 수
              있습니다
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 검색창 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="환자 ID, 이름, 진단 부위 검색..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>

            {/* 필터 버튼들 */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-600">필터:</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={selectedFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange("all")}
                >
                  전체
                </Button>
                <Button
                  variant={
                    selectedFilter === "malignant" ? "destructive" : "outline"
                  }
                  size="sm"
                  onClick={() => handleFilterChange("malignant")}
                >
                  악성
                </Button>
                <Button
                  variant={
                    selectedFilter === "benign" ? "secondary" : "outline"
                  }
                  size="sm"
                  onClick={() => handleFilterChange("benign")}
                >
                  양성
                </Button>
              </div>
              <Separator orientation="vertical" className="h-6" />
              <Button
                onClick={fetchPatients}
                disabled={isLoading}
                variant="outline"
                size="sm"
                className="ml-auto"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    새로고침 중...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    새로고침
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 환자 목록 테이블 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                환자 목록
              </span>
              <Badge variant="outline">{filteredPatients.length}명 표시</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                  <p className="text-gray-600">환자 데이터를 불러오는 중...</p>
                </div>
              </div>
            ) : filteredPatients.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  환자를 찾을 수 없습니다
                </h3>
                <p className="text-gray-600">
                  검색 조건을 변경하거나 필터를 조정해보세요
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>환자 정보</TableHead>
                      <TableHead>나이</TableHead>
                      <TableHead>진단 부위</TableHead>
                      <TableHead>진단 결과</TableHead>
                      <TableHead>신뢰도</TableHead>
                      <TableHead>진단일</TableHead>
                      <TableHead className="text-right">액션</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPatients.map((patient, index) => (
                      <TableRow key={index} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <User className="h-4 w-4 text-blue-600" />
                            <div>
                              <div className="font-medium text-gray-900">
                                {patient.patient_name}
                              </div>
                              <div className="text-sm text-gray-600">
                                ID: {patient.patient_id}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-900">
                          {patient.age_approx}세
                        </TableCell>
                        <TableCell className="text-gray-900">
                          {patient.location ||
                            patient.anatom_site_general_challenge ||
                            "-"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              patient.benign_malignant === "malignant"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {patient.benign_malignant === "malignant"
                              ? "악성"
                              : "양성"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {patient.confidence_score ? (
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{
                                    width: `${patient.confidence_score * 100}%`,
                                  }}
                                />
                              </div>
                              <span className="text-xs text-gray-600">
                                {(patient.confidence_score * 100).toFixed(0)}%
                              </span>
                            </div>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {patient.diagnosed_at
                            ? new Date(patient.diagnosed_at).toLocaleDateString(
                                "ko-KR"
                              )
                            : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Link to={`/patient/${patient.patient_id}`}>
                            <Button size="sm" variant="outline">
                              상세보기
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientManagement;
