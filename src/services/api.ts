import { mockApiService, USE_MOCK_API } from "./mockApi";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export interface DiagnosisRequest {
  file: File;
  patient_name: string;
  patient_age: number;
  patient_id: string;
  patient_sex: string;
  anatomy_site: string;
}

export interface DiagnosisResponse {
  total_diagnosis_summary: string;
  diagnosis: string;
  medical_image_id: number;
  ai_description: string;
  confidence_score: number;
}

export interface ConversationInput {
  patient_id: string;
  conversation: string;
}

export interface CommunicationSummary {
  의사_소견: string;
  환자의_우려점: string;
  진료_계획: string;
  처방: string;
}

export interface PatientDiagnosis {
  patient_id: string;
  patient_name: string;
  diagnoses: Array<{
    anatom_site_general_challenge: string | null;
    location: string | null;
    benign_malignant: string | null;
    age_approx: number;
    confidence_score: number;
    diagnosed_by: string;
    diagnosed_at: string;
  }>;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(
        `API 요청 실패: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  // 진단하기
  async diagnose(data: DiagnosisRequest): Promise<DiagnosisResponse> {
    // Mock API 사용 시
    if (USE_MOCK_API) {
      return mockApiService.diagnose(data);
    }

    // 실제 API 호출
    const formData = new FormData();
    formData.append("file", data.file);
    formData.append("patient_name", data.patient_name);
    formData.append("patient_age", data.patient_age.toString());
    formData.append("patient_id", data.patient_id);
    formData.append("patient_sex", data.patient_sex);
    formData.append("anatomy_site", data.anatomy_site);

    const response = await fetch(`${API_BASE_URL}/diagnose`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`진단 API 요청 실패: ${response.status}`);
    }

    return response.json();
  }

  // STT 기반 대화 요약
  async createSummary(data: ConversationInput): Promise<CommunicationSummary> {
    // Mock API 사용 시
    if (USE_MOCK_API) {
      return mockApiService.createSummary(data);
    }

    // 실제 API 호출
    return this.request<CommunicationSummary>("/summarize", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // 최신 요약 조회
  async getLatestSummary(patientId: string): Promise<{
    patient_id: string;
    latest_summary: CommunicationSummary;
    created_at: string;
  }> {
    // Mock API 사용 시
    if (USE_MOCK_API) {
      return mockApiService.getLatestSummary(patientId);
    }

    // 실제 API 호출
    return this.request(`/summary/${patientId}`);
  }

  // 전체 진단 기록 조회
  async getDiagnoses(): Promise<PatientDiagnosis> {
    // Mock API 사용 시
    if (USE_MOCK_API) {
      return mockApiService.getDiagnoses();
    }

    // 실제 API 호출
    return this.request("/diagnoses");
  }

  // 특정 환자의 진단 결과 조회
  async getDiagnosis(patientId: string): Promise<DiagnosisResponse> {
    // Mock API 사용 시
    if (USE_MOCK_API) {
      return mockApiService.getDiagnosis(patientId);
    }

    // 실제 API 호출
    return this.request(`/diagnosis/${patientId}`);
  }
}

export const apiService = new ApiService();
