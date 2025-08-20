# KOREN Frontend

의료 진단을 위한 프론트엔드 애플리케이션입니다.

## 설치 및 실행

```bash
npm i
npm run dev
```

## STT 기능 사용법

### 음성 인식 (Speech-to-Text)

1. 메인 화면의 진단 메모 아래에 있는 "음성 인식 및 요약" 섹션을 찾습니다
2. 마이크 버튼을 클릭하여 음성 인식을 시작합니다
3. 말씀하신 후 다시 마이크 버튼을 클릭하여 음성 인식을 중지합니다
4. **브라우저의 Web Speech API를 사용하여 프론트엔드에서 직접 음성을 텍스트로 변환합니다**

### 화자 식별 (Speaker Diarization)

**⚠️ 현재 구현된 Web Speech API로는 화자 식별이 불가능합니다.**

화자 식별이 필요한 경우:

- **Google Cloud Speech-to-Text**: `enable_speaker_diarization` 옵션
- **Azure Speech Services**: 화자 식별 API 제공
- **AWS Transcribe**: 다중 화자 식별 지원

이러한 서비스들은 별도의 백엔드 API 구현이 필요합니다.

### 요약 생성

1. 음성 인식이 완료된 후 "요약 생성" 버튼을 클릭합니다
2. 백엔드 서버에서 AI를 통해 텍스트를 요약합니다
3. 요약 결과가 표시되고, 자동으로 진단 메모에 추가됩니다

## 환경 변수 설정

백엔드 API 엔드포인트를 설정하려면 `.env.local` 파일을 생성하고 다음을 추가하세요:

```env
VITE_SUMMARY_API_URL=http://localhost:8000/api/summarize
VITE_BACKEND_URL=http://localhost:8000
```

**참고**: STT는 프론트엔드에서 Web Speech API로 처리되므로 별도의 STT API 엔드포인트가 필요하지 않습니다.

## 백엔드 API 요구사항

### STT API (`/api/stt`)

**⚠️ 더 이상 필요하지 않습니다. STT는 프론트엔드에서 Web Speech API로 처리됩니다.**

### 요약 API (`/api/summarize`)

### 요약 API (`/api/summarize`)

- **Method**: POST
- **Content-Type**: application/json
- **Body**: `{ text: string }`
- **Response**: `{ summary: string }`

## 기술 스택

- React 18
- TypeScript
- Tailwind CSS
- Shadcn/ui
- Vite
- Web Speech API (STT)
