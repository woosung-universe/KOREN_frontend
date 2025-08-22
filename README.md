# KOREN Frontend

피부암 진단을 위한 AI 기반 웹 애플리케이션입니다.

## 🚀 주요 기능

- **AI 진단**: 피부 이미지를 업로드하여 AI 모델로 진단
- **음성 인식**: STT를 통한 대화 요약 및 진료 기록
- **모델 학습**: Federated Learning을 통한 모델 업데이트
- **진단 기록**: 환자별 진단 이력 및 데이터 분석

## 🛠️ 기술 스택

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + Shadcn/ui
- **State Management**: React Context + React Query
- **API**: FastAPI 백엔드 연동

## 📦 설치 및 실행

### 1. 의존성 설치

```bash
npm install
# 또는
yarn install
# 또는
bun install
```

### 2. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# 백엔드 API 설정
VITE_API_BASE_URL=http://localhost:8000

# 기타 환경 변수
VITE_APP_NAME=KOREN Frontend
```

### 3. 개발 서버 실행

```bash
npm run dev
# 또는
yarn dev
# 또는
bun dev
```

## 🔌 API 엔드포인트

### 진단 관련

- `POST /diagnose` - 이미지 업로드 및 AI 진단
- `GET /diagnosis/{patient_id}` - 특정 환자의 진단 결과
- `GET /diagnoses` - 전체 진단 기록 조회

### STT 요약 관련

- `POST /summarize` - 대화 텍스트 요약 생성
- `GET /summary/{patient_id}` - 최신 요약 조회

### 모델 학습 관련

- `POST /train` - Federated Learning 모델 학습 시작
- `GET /training/status/{job_id}` - 학습 진행 상황 확인

## 📱 페이지 구성

### 1. 메인 페이지 (`/`)

- 피부 이미지 업로드
- 환자 정보 입력
- AI 진단 실행
- STT 음성 인식 및 요약

### 2. 진단 기록 (`/diagnosis-history`)

- 캘린더 뷰로 진단 기록 확인
- 데이터 테이블로 상세 정보 조회
- 백엔드 데이터 동기화

### 3. 모델 학습 (`/training`)

- CSV 데이터셋 업로드
- Federated Learning 실행
- 학습 진행 상황 모니터링

## 🎯 주요 컴포넌트

### STTComponent

- Web Speech API를 사용한 음성 인식
- OpenAI GPT를 통한 대화 요약
- 보라색 박스로 요약 결과 표시

### DiagnosisCard

- 이미지 업로드 및 미리보기
- 환자 정보 입력 폼
- 백엔드 API 연동 진단

### Training

- 파일 업로드 및 검증
- 학습 상태 관리
- 완료 후 결과 표시

## 🔧 개발 가이드

### API 서비스 추가

`src/services/api.ts`에 새로운 API 메서드를 추가하세요:

```typescript
// 새로운 API 메서드 예시
async newApiMethod(data: NewDataType): Promise<NewResponseType> {
  return this.request<NewResponseType>('/new-endpoint', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
```

### 컴포넌트에서 API 사용

```typescript
import { apiService } from "@/services/api";

const handleApiCall = async () => {
  try {
    const result = await apiService.newApiMethod(data);
    // 결과 처리
  } catch (error) {
    // 에러 처리
  }
};
```

## 🚨 주의사항

1. **백엔드 서버**: FastAPI 백엔드가 `http://localhost:8000`에서 실행 중이어야 합니다.
2. **환경 변수**: `.env.local` 파일이 올바르게 설정되어야 합니다.
3. **CORS**: 백엔드에서 프론트엔드 도메인을 허용해야 합니다.

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.
