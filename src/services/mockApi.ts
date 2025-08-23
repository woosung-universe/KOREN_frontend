// Mock API 데이터와 함수들
import type {
  DiagnosisRequest,
  DiagnosisResponse,
  ConversationInput,
  CommunicationSummary,
  PatientDiagnosis,
} from "./api";

// Mock 데이터
const mockPatients = [
  {
    patient_id: "P001",
    patient_name: "김철수",
    age: 45,
    sex: "male",
  },
  {
    patient_id: "P002",
    patient_name: "이영희",
    age: 38,
    sex: "female",
  },
  {
    patient_id: "P003",
    patient_name: "박민수",
    age: 52,
    sex: "male",
  },
];

const mockDiagnoses = [
  {
    anatom_site_general_challenge: "head/neck",
    location: "head/neck",
    benign_malignant: "benign",
    age_approx: 45,
    confidence_score: 0.85,
    diagnosed_by: "AI_MODEL",
    diagnosed_at: "2024-01-15T10:30:00Z",
  },
  {
    anatom_site_general_challenge: "torso",
    location: "torso",
    benign_malignant: "malignant",
    age_approx: 38,
    confidence_score: 0.92,
    diagnosed_by: "AI_MODEL",
    diagnosed_at: "2024-01-14T14:20:00Z",
  },
  {
    anatom_site_general_challenge: "upper extremity",
    location: "upper extremity",
    benign_malignant: "benign",
    age_approx: 52,
    confidence_score: 0.78,
    diagnosed_by: "AI_MODEL",
    diagnosed_at: "2024-01-13T09:15:00Z",
  },
];

// 지연 시뮬레이션 함수
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API 함수들
export const mockApiService = {
  // 진단하기
  async diagnose(data: DiagnosisRequest): Promise<DiagnosisResponse> {
    console.log("Mock API - 진단 요청:", data);

    // 1-3초 지연 시뮬레이션
    await delay(Math.random() * 2000 + 1000);

    // 랜덤하게 악성/양성 결정 (실제로는 AI 모델 결과)
    const isRandomMalignant = Math.random() > 0.7; // 30% 확률로 악성
    const confidence = Math.random() * 0.3 + 0.7; // 0.7~1.0 사이 신뢰도

    const diagnosis = isRandomMalignant ? "malignant" : "benign";

    return {
      total_diagnosis_summary: JSON.stringify(
        {
          "환자의 상태": `${data.patient_name}님의 ${data.anatomy_site} 부위 피부 병변 검사 완료`,
          "처방 및 진료 내용":
            diagnosis === "malignant"
              ? "조직검사 및 전문의 상담 필요, 추가 정밀검사 권장"
              : "양성 병변으로 추정, 경과 관찰 및 정기 검진 권장",
          "진료 계획":
            diagnosis === "malignant"
              ? "피부과 전문의 진료, MRI/CT 검사, 치료 계획 수립"
              : "3개월 후 재검진, 자가 관찰 지속",
        },
        null,
        2
      ),
      diagnosis,
      medical_image_id: Math.floor(Math.random() * 1000) + 1,
      ai_description: `AI 모델이 ${
        diagnosis === "malignant" ? "악성" : "양성"
      } 병변으로 분석했습니다. 신뢰도: ${(confidence * 100).toFixed(1)}%`,
      confidence_score: confidence,
    };
  },

  // STT 기반 대화 요약
  async createSummary(data: ConversationInput): Promise<CommunicationSummary> {
    console.log("Mock API - 요약 요청:", data);

    // 1-2초 지연 시뮬레이션
    await delay(Math.random() * 1000 + 1000);

    // 실제로는 GPT API를 호출하지만, 여기서는 Mock 데이터 반환
    const mockSummaries = [
      {
        의사_소견:
          "환자가 호소하는 피부 병변에 대해 육안 검사 결과 비정형적 특징 관찰됨",
        환자의_우려점: "최근 크기가 커지고 색깔이 변한 점에 대한 우려 표현",
        진료_계획: "조직검사를 통한 정확한 진단 후 치료 방향 결정",
        처방: "항염제 연고 처방, 2주 후 재진료 예약",
      },
      {
        의사_소견: "양성 병변으로 추정되나 경계 관찰 필요",
        환자의_우려점: "가족력으로 인한 불안감 및 재발 가능성 문의",
        진료_계획: "정기적 경과 관찰 및 자가 점검 교육",
        처방: "보습제 사용, 자외선 차단 권고",
      },
      {
        의사_소견: "염증성 피부 질환으로 보이며 감염 소견 없음",
        환자의_우려점: "업무상 스트레스와 피부 상태 악화의 연관성 문의",
        진료_계획: "생활습관 개선 및 스트레스 관리 상담",
        처방: "스테로이드 연고 단기 사용, 항히스타민제 처방",
      },
    ];

    return mockSummaries[Math.floor(Math.random() * mockSummaries.length)];
  },

  // 최신 요약 조회
  async getLatestSummary(patientId: string): Promise<{
    patient_id: string;
    latest_summary: CommunicationSummary;
    created_at: string;
  }> {
    console.log("Mock API - 최신 요약 조회:", patientId);

    await delay(500);

    // 환자 ID에 따라 다른 요약 데이터 반환
    const summaryMap: Record<string, CommunicationSummary> = {
      P001: {
        의사_소견:
          "환자가 호소하는 피부 병변에 대해 육안 검사 결과 비정형적 특징 관찰됨. 경계가 불규칙하고 색소 침착이 다양함.",
        환자의_우려점:
          "최근 크기가 커지고 색깔이 변한 점에 대한 우려 표현. 가족력으로 인한 불안감 지속적으로 호소.",
        진료_계획:
          "조직검사를 통한 정확한 진단 후 치료 방향 결정. 피부과 전문의 진료 의뢰 예정.",
        처방: "항염제 연고 처방, 2주 후 재진료 예약. 자외선 차단 철저히 시행하도록 교육.",
      },
      P002: {
        의사_소견:
          "양성 병변으로 추정되나 경계 관찰 필요. 염증 소견은 없으나 크기 변화 모니터링 중요.",
        환자의_우려점:
          "업무 스트레스와 피부 상태 악화의 연관성 문의. 화장품 사용에 대한 주의사항 질문.",
        진료_계획:
          "정기적 경과 관찰 및 자가 점검 교육. 생활습관 개선 상담 진행.",
        처방: "보습제 사용 권장, 스테로이드 연고 단기 사용. 항히스타민제 필요시 복용.",
      },
      P003: {
        의사_소견:
          "염증성 피부 질환으로 보이며 감염 소견 없음. 기존 치료에 양호한 반응 보임.",
        환자의_우려점:
          "직업적 노출과 관련된 재발 가능성 우려. 예방법에 대한 구체적 교육 요청.",
        진료_계획:
          "현재 치료 지속하며 월 1회 경과 관찰. 작업환경 개선 방안 논의.",
        처방: "기존 처방 유지, 보호장비 착용 철저. 악화 시 즉시 내원 교육.",
      },
    };

    const defaultSummary: CommunicationSummary = {
      의사_소견: "정기 검진에서 확인된 일반적인 피부 소견",
      환자의_우려점: "전반적인 피부 건강 상태에 대한 문의",
      진료_계획: "정기적 경과 관찰 및 건강 관리",
      처방: "일반적인 피부 관리 지침 제공",
    };

    return {
      patient_id: patientId,
      latest_summary: summaryMap[patientId] || defaultSummary,
      created_at: new Date(
        Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
      ).toISOString(), // 최근 7일 내 랜덤 시간
    };
  },

  // 전체 진단 기록 조회
  async getDiagnoses(): Promise<PatientDiagnosis> {
    console.log("Mock API - 진단 기록 조회");

    await delay(800);

    // 각 환자별로 고유한 진단 데이터 생성
    const allPatientsData = mockPatients.map((patient, patientIndex) => {
      // 각 환자마다 다른 진단 데이터 생성 (환자별로 3-5개씩)
      const patientDiagnosesCount = 3 + Math.floor(Math.random() * 3); // 3-5개

      const patientDiagnoses = Array.from(
        { length: patientDiagnosesCount },
        (_, index) => {
          // 환자별로 다른 진단 부위와 결과를 랜덤하게 생성
          const bodyParts = [
            "head/neck",
            "torso",
            "upper extremity",
            "lower extremity",
            "face",
            "back",
          ];
          const randomBodyPart =
            bodyParts[Math.floor(Math.random() * bodyParts.length)];
          const isMalignant = Math.random() > 0.7; // 30% 확률로 악성

          return {
            anatom_site_general_challenge: randomBodyPart,
            location: randomBodyPart,
            benign_malignant: isMalignant ? "malignant" : "benign",
            age_approx: patient.age + Math.floor(Math.random() * 10) - 5, // ±5세 변동
            confidence_score: Math.min(
              0.95,
              Math.max(0.7, 0.7 + Math.random() * 0.25)
            ),
            diagnosed_by: "AI_MODEL",
            diagnosed_at: new Date(
              Date.now() -
                patientIndex * 7 * 24 * 60 * 60 * 1000 - // 환자별로 7일씩 차이
                index * 2 * 24 * 60 * 60 * 1000 // 진단별로 2일씩 차이
            ).toISOString(),
          };
        }
      );

      return {
        patient_id: patient.patient_id,
        patient_name: patient.patient_name,
        diagnoses: patientDiagnoses,
      };
    });

    // 모든 환자의 진단 데이터를 하나로 합치되, patient_id를 올바르게 매핑
    const allDiagnoses = allPatientsData.flatMap((patient) =>
      patient.diagnoses.map((diagnosis) => ({
        ...diagnosis,
        // 각 진단에 해당 환자의 정보를 포함
        patient_id: patient.patient_id,
        patient_name: patient.patient_name,
      }))
    );

    // 첫 번째 환자의 정보를 기본으로 반환하되, 전체 진단 데이터 포함
    return {
      patient_id: allPatientsData[0].patient_id,
      patient_name: allPatientsData[0].patient_name,
      diagnoses: allDiagnoses,
    };
  },

  // 특정 환자의 진단 결과 조회
  async getDiagnosis(patientId: string): Promise<DiagnosisResponse> {
    console.log("Mock API - 특정 환자 진단 조회:", patientId);

    await delay(600);

    // 환자 ID에 따라 다른 진단 데이터 반환
    const diagnosisMap: Record<string, DiagnosisResponse> = {
      P001: {
        total_diagnosis_summary: JSON.stringify({
          "환자의 상태": "45세 남성, 두경부 피부 병변 검사",
          "처방 및 진료 내용": "조직검사 필요, 전문의 상담 권장",
          "진료 계획": "피부과 전문의 진료, 추가 정밀검사",
        }),
        diagnosis: "malignant",
        medical_image_id: 10001,
        ai_description:
          "AI 분석 결과 악성 가능성이 높은 병변으로 판정. 비정형적 형태와 색소 침착 패턴이 관찰됨.",
        confidence_score: 0.87,
      },
      P002: {
        total_diagnosis_summary: JSON.stringify({
          "환자의 상태": "38세 여성, 몸통 부위 피부 병변 검사",
          "처방 및 진료 내용": "양성 병변으로 확인, 경과 관찰",
          "진료 계획": "3개월 후 재검진, 자가 관찰 교육",
        }),
        diagnosis: "benign",
        medical_image_id: 10002,
        ai_description:
          "AI 분석 결과 양성 병변으로 판정. 규칙적인 경계와 균일한 색소 분포 확인됨.",
        confidence_score: 0.93,
      },
      P003: {
        total_diagnosis_summary: JSON.stringify({
          "환자의 상태": "52세 남성, 상지 부위 피부 병변 검사",
          "처방 및 진료 내용": "염증성 병변으로 판정, 치료 진행",
          "진료 계획": "항염 치료 지속, 월 1회 경과 관찰",
        }),
        diagnosis: "benign",
        medical_image_id: 10003,
        ai_description:
          "AI 분석 결과 염증성 양성 병변으로 판정. 치료에 양호한 반응 예상됨.",
        confidence_score: 0.81,
      },
    };

    const defaultDiagnosis: DiagnosisResponse = {
      total_diagnosis_summary: JSON.stringify({
        "환자의 상태": "일반적인 피부 검진",
        "처방 및 진료 내용": "특이 소견 없음",
        "진료 계획": "정기 검진 지속",
      }),
      diagnosis: "benign",
      medical_image_id: Math.floor(Math.random() * 1000) + 1,
      ai_description: "AI 분석 결과 정상 범위의 피부 소견",
      confidence_score: 0.75 + Math.random() * 0.2, // 0.75-0.95 사이
    };

    return diagnosisMap[patientId] || defaultDiagnosis;
  },
};

// 개발 모드에서 Mock API 사용 여부를 결정하는 플래그
export const USE_MOCK_API =
  import.meta.env.VITE_USE_MOCK_API === "true" || import.meta.env.DEV;
