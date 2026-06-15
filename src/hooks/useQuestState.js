import { useState, useCallback, useEffect, useRef } from 'react';

// ─── Tutorial 1: Resume 정적 호스팅 ───
export const TUTORIAL_1_STEPS = [
  {
    id: 't1_region', title: '리전 설정', type: 'console', service: 'header',
    description: '우측 상단 리전을 "서울 (ap-northeast-2)"로 설정하세요.',
    why: 'AWS는 전 세계 여러 데이터센터(리전)에 서비스를 운영해요. 서울 리전을 선택하면 한국 사용자에게 가장 낮은 지연시간을 제공하고, 요금도 리전마다 다르게 책정돼요.',
    concept: '리전 = 물리적 데이터센터 묶음. 내 서비스를 어느 나라 서버에 올릴지 결정해요.',
  },
  {
    id: 't1_c9_create', title: 'Cloud9 환경 생성', type: 'console', service: 'cloud9',
    description: 'Cloud9을 검색하고 이름(예: DT6-c9)과 t3.small을 선택하여 생성하세요.',
    why: 'Cloud9은 브라우저에서 실행되는 가상 개발 환경이에요. 내 컴퓨터에 아무것도 설치하지 않아도 AWS CLI, git, Node.js가 모두 세팅된 서버를 즉시 사용할 수 있어요.',
    concept: 'Cloud9 = AWS가 대신 켜주는 개발용 서버 + IDE. 실제로는 EC2 인스턴스(가상 컴퓨터)가 생성돼요.',
  },
  {
    id: 't1_c9_open', title: 'Cloud9 IDE 열기', type: 'console', service: 'cloud9',
    description: '생성된 환경의 "열림" 버튼을 눌러 터미널에 진입하세요.',
    why: '"열림" 버튼을 누르면 EC2 인스턴스에 SSH로 자동 연결된 터미널이 브라우저 안에서 열려요. 이제부터 이 터미널이 AWS 서버 위의 리눅스 환경이에요.',
    concept: 'EC2 인스턴스 = 클라우드의 가상 컴퓨터. 물리 서버를 소프트웨어로 쪼개 빌려주는 개념이에요.',
  },
  {
    id: 't1_clone', title: '실습 코드 다운로드', type: 'terminal', service: 'terminal',
    description: '`git clone https://github.com/nxtcloud-org/Nxt-Classic-Architecture.git`',
    why: '실습에 필요한 소스코드를 GitHub에서 서버로 가져와요. 이 명령어 하나로 전체 프로젝트 파일이 EC2 서버에 복사돼요.',
    concept: 'git clone = 원격 저장소(GitHub)의 코드를 현재 서버로 복사하는 명령어예요.',
  },
  {
    id: 't1_cd', title: '디렉토리 이동', type: 'terminal', service: 'terminal',
    description: '`cd /home/ec2-user/environment/Nxt-Classic-Architecture/1.Tutorial/3.Resume`',
    why: '다운받은 저장소 안에 여러 프로젝트가 있어요. 이번 실습 대상인 Resume 폴더로 작업 위치를 이동해야 해요.',
    concept: 'cd (change directory) = 현재 작업 위치를 바꾸는 터미널 명령어예요.',
  },
  {
    id: 't1_npm_install', title: '종속성 설치', type: 'terminal', service: 'terminal',
    description: '`npm install`',
    why: 'React 프로젝트는 수백 개의 외부 라이브러리에 의존해요. package.json에 목록만 있고 실제 파일은 없으니, npm install로 모두 다운로드해야 실행할 수 있어요.',
    concept: 'npm = Node.js 패키지 관리자. node_modules 폴더에 라이브러리들이 설치돼요.',
  },
  {
    id: 't1_npm_build', title: '프로젝트 빌드', type: 'terminal', service: 'terminal',
    description: '`npm run build`',
    why: 'React 코드(JSX)는 브라우저가 직접 이해하지 못해요. 빌드 과정에서 브라우저가 읽을 수 있는 순수 HTML/CSS/JS 파일로 변환돼요. 이 결과물이 build/ 폴더에 생겨요.',
    concept: '빌드 = 소스코드 → 배포 가능한 정적 파일 변환. 개발용 코드와 배포용 파일은 달라요.',
  },
  {
    id: 't1_s3_create', title: 'S3 버킷 생성', type: 'console', service: 's3',
    description: 'S3를 검색하고 버킷을 생성하세요. 반드시 퍼블릭 액세스 차단을 해제해야 합니다.',
    why: 'S3 버킷은 파일을 저장하는 공간이에요. AWS는 기본적으로 모든 접근을 차단(보안 우선)해요. 웹 호스팅은 인터넷 누구나 접근해야 하니까, 이 기본 차단을 해제해야 해요.',
    concept: 'S3 = Simple Storage Service = 클라우드 파일 저장소. 버킷은 최상위 폴더 개념이에요.',
  },
  {
    id: 't1_s3_policy', title: 'S3 버킷 정책 설정', type: 'console', service: 's3',
    description: '권한 탭에서 버킷 정책(s3:GetObject)을 입력하고 저장하세요.',
    why: '퍼블릭 액세스 차단을 해제해도 아직 접근이 안 돼요. JSON 정책으로 "모든 사람(*)이 이 버킷의 파일을 읽을(GetObject) 수 있다"고 명시적으로 허용해야 해요.',
    concept: 'IAM 정책 = AWS 리소스 접근 권한을 JSON으로 정의하는 규칙. 누가·무엇을·어디에 할 수 있는지 명시해요.',
  },
  {
    id: 't1_s3_hosting', title: '정적 웹 호스팅 활성화', type: 'console', service: 's3',
    description: '속성 탭에서 정적 웹 사이트 호스팅을 활성화하세요.',
    why: '일반 S3는 파일 다운로드용 스토리지예요. 웹 호스팅 모드를 켜야 index.html을 기본 페이지로 서빙하고, 고유한 웹사이트 URL(엔드포인트)이 생성돼요.',
    concept: '정적 웹 호스팅 = 서버 로직 없이 HTML/CSS/JS 파일만으로 웹사이트를 운영하는 방식이에요.',
  },
  {
    id: 't1_s3_cp', title: 'build 폴더 S3 업로드', type: 'terminal', service: 'terminal',
    description: '`aws s3 cp build s3://<버킷명> --recursive`',
    why: '빌드된 파일이 EC2 서버에만 있어요. S3에 올려야 외부에서 접근할 수 있어요. --recursive 옵션으로 build/ 폴더 안의 모든 파일을 한 번에 업로드해요.',
    concept: 'AWS CLI = 터미널에서 AWS 서비스를 제어하는 명령어 도구. 설치 없이 Cloud9에서 바로 쓸 수 있어요.',
  },
  {
    id: 't1_finish', title: '배포 확인', type: 'console', service: 's3',
    description: 'S3 엔드포인트 URL을 클릭하여 호스팅된 웹사이트를 확인하세요!',
    why: 'S3 정적 호스팅 엔드포인트 URL로 접속하면 전 세계 누구나 내 웹사이트에 접근할 수 있어요. EC2 서버 없이 S3만으로 호스팅이 완성된 거예요!',
    concept: '엔드포인트 = 서비스에 접근하는 고유 URL. 이 URL이 곧 내 웹사이트 주소가 돼요.',
  },
];

// ─── Tutorial 2: RandomTextApp (S3 + EC2 서버 + RDS) ───
export const TUTORIAL_2_STEPS = [
  { id: 't2_region', title: '리전 설정', description: '우측 상단 리전을 "서울 (ap-northeast-2)"로 설정하세요.', type: 'console', service: 'header' },
  { id: 't2_c9_create', title: 'Cloud9 환경 생성', description: 'Cloud9을 검색하고 t3.small로 새 환경을 생성하세요.', type: 'console', service: 'cloud9' },
  { id: 't2_c9_open', title: 'Cloud9 IDE 열기', description: '"열림" 버튼을 눌러 터미널에 진입하세요.', type: 'console', service: 'cloud9' },
  { id: 't2_clone', title: '실습 코드 다운로드', description: '`git clone https://github.com/nxtcloud-org/Nxt-Classic-Architecture.git`', type: 'terminal', service: 'terminal' },
  { id: 't2_cd_client', title: 'client 폴더로 이동', description: '`cd /home/ec2-user/environment/Nxt-Classic-Architecture/2.RandomTextApp/client`', type: 'terminal', service: 'terminal' },
  { id: 't2_npm_install_client', title: 'client 종속성 설치', description: '`npm install`', type: 'terminal', service: 'terminal' },
  { id: 't2_npm_build_client', title: 'client 빌드', description: '`npm run build`', type: 'terminal', service: 'terminal' },
  { id: 't2_s3_create', title: 'S3 버킷 생성', description: '버킷을 생성하세요. 퍼블릭 액세스 차단을 반드시 해제해야 합니다.', type: 'console', service: 's3' },
  { id: 't2_s3_policy', title: 'S3 버킷 정책 설정', description: '권한 탭에서 s3:GetObject 정책을 저장하세요.', type: 'console', service: 's3' },
  { id: 't2_s3_hosting', title: '정적 웹 호스팅 활성화', description: '속성 탭에서 정적 웹 사이트 호스팅을 활성화하세요.', type: 'console', service: 's3' },
  { id: 't2_s3_cp_client', title: 'client build → S3 업로드', description: '`aws s3 cp build s3://<버킷명> --recursive`', type: 'terminal', service: 'terminal' },
  { id: 't2_rds_create', title: 'RDS 데이터베이스 생성', description: 'RDS를 검색하고 MySQL, 프리티어, 퍼블릭 액세스 = 예로 DB를 생성하세요.', type: 'console', service: 'rds' },
  { id: 't2_sg_rds', title: '보안그룹 인바운드 규칙 추가 (3306)', description: '생성된 DB의 보안 그룹에서 MySQL/Aurora (3306) 인바운드 규칙을 추가하세요.', type: 'console', service: 'ec2' },
  { id: 't2_mysql_connect', title: 'MySQL 접속', description: '`mysql -h <RDS endpoint> -P 3306 -u <username> -p`', type: 'terminal', service: 'terminal' },
  { id: 't2_create_db', title: 'Database 생성', description: '`CREATE DATABASE texts;`', type: 'terminal', service: 'terminal' },
  { id: 't2_mysql_exit', title: 'MySQL 종료', description: '`EXIT;`', type: 'terminal', service: 'terminal' },
  { id: 't2_cd_server', title: 'server 폴더로 이동', description: '`cd /home/ec2-user/environment/Nxt-Classic-Architecture/2.RandomTextApp/server`', type: 'terminal', service: 'terminal' },
  { id: 't2_npm_install_server', title: 'server 종속성 설치', description: '`npm install`', type: 'terminal', service: 'terminal' },
  { id: 't2_env_server', title: 'server .env 파일 수정', description: '.env.example → .env로 이름 변경 후 DB 접속 정보를 입력하세요.', type: 'console', service: 'cloud9' },
  { id: 't2_node_server', title: '서버 실행', description: '`node server.js`', type: 'terminal', service: 'terminal' },
  { id: 't2_sg_ec2', title: '보안그룹 인바운드 규칙 추가 (8080)', description: 'EC2 → 보안그룹에서 사용자 지정 TCP (8080) 인바운드 규칙을 추가하세요.', type: 'console', service: 'ec2' },
  { id: 't2_client_env', title: 'client .env 파일 수정', description: 'client .env에 REACT_APP_SERVER_URL=http://<EC2 IP>:8080 을 입력하세요.', type: 'console', service: 'cloud9' },
  { id: 't2_rebuild', title: 'client 재빌드 → S3 재업로드', description: '`npm run build` 후 `aws s3 cp build s3://<버킷명> --recursive`', type: 'terminal', service: 'terminal' },
  { id: 't2_finish', title: '앱 연결 확인', description: 'S3 엔드포인트 URL에서 랜덤 명언이 출력되는 것을 확인하세요!', type: 'console', service: 's3' },
];

// ─── Tutorial 3: AI Note App (S3 + EC2 서버 + RDS + Lambda) ───
export const TUTORIAL_3_STEPS = [
  { id: 't3_region', title: '리전 설정', description: '우측 상단 리전을 "서울 (ap-northeast-2)"로 설정하세요.', type: 'console', service: 'header' },
  { id: 't3_s3_create', title: 'S3 버킷 생성', description: '버킷을 생성하세요. 퍼블릭 액세스 차단을 해제해야 합니다.', type: 'console', service: 's3' },
  { id: 't3_s3_hosting', title: '정적 웹 호스팅 활성화', description: '속성 탭에서 정적 웹 사이트 호스팅을 활성화하세요.', type: 'console', service: 's3' },
  { id: 't3_s3_policy', title: 'S3 버킷 정책 설정', description: '권한 탭에서 s3:GetObject 정책을 저장하세요.', type: 'console', service: 's3' },
  { id: 't3_c9_create', title: 'Cloud9 환경 생성', description: 'Cloud9을 검색하고 t3.small로 새 환경을 생성하세요.', type: 'console', service: 'cloud9' },
  { id: 't3_c9_open', title: 'Cloud9 IDE 열기', description: '"열림" 버튼을 눌러 터미널에 진입하세요.', type: 'console', service: 'cloud9' },
  { id: 't3_clone', title: '실습 코드 다운로드', description: '`git clone https://github.com/nxtcloud-org/Nxt-Classic-Architecture.git`', type: 'terminal', service: 'terminal' },
  { id: 't3_cd_client', title: 'serverless/client 폴더로 이동', description: '`cd ~/environment/Nxt-Classic-Architecture/3.AiNoteApp/serverless/client`', type: 'terminal', service: 'terminal' },
  { id: 't3_npm_install', title: 'client 종속성 설치', description: '`npm install`', type: 'terminal', service: 'terminal' },
  { id: 't3_npm_build', title: 'client 빌드', description: '`npm run build`', type: 'terminal', service: 'terminal' },
  { id: 't3_s3_cp', title: 'build → S3 업로드', description: '`aws s3 cp build s3://<버킷명> --recursive`', type: 'terminal', service: 'terminal' },
  { id: 't3_rds_create', title: 'RDS 데이터베이스 생성', description: 'RDS를 검색하고 MySQL, 프리티어로 DB를 생성하세요.', type: 'console', service: 'rds' },
  { id: 't3_sg_rds', title: '보안그룹 인바운드 (3306)', description: 'DB 보안 그룹에서 MySQL/Aurora (3306) 인바운드 규칙을 추가하세요.', type: 'console', service: 'ec2' },
  { id: 't3_mysql_db', title: 'DB 생성 (MySQL)', description: '`mysql -h <RDS endpoint> ...` → `CREATE DATABASE db_xxx;` → `EXIT;`', type: 'terminal', service: 'terminal' },
  { id: 't3_env_files', title: '.env 파일 수정', description: 'server/.env 및 client/.env에 DB 정보와 서버 URL을 입력하세요.', type: 'console', service: 'cloud9' },
  { id: 't3_sg_ec2', title: '보안그룹 인바운드 (80)', description: 'EC2 보안그룹에서 HTTP (80) 인바운드 규칙을 추가하세요.', type: 'console', service: 'ec2' },
  { id: 't3_cd_server', title: 'serverless/server 폴더로 이동', description: '`cd ~/environment/Nxt-Classic-Architecture/3.AiNoteApp/serverless/server`', type: 'terminal', service: 'terminal' },
  { id: 't3_server_run', title: '서버 실행', description: '`npm install` 후 `sudo node server.js`', type: 'terminal', service: 'terminal' },
  { id: 't3_lambda_create', title: 'Lambda 함수 생성', description: 'Lambda를 검색하고 함수를 생성하세요. (이름 설정, 기존 역할 사용)', type: 'console', service: 'lambda' },
  { id: 't3_lambda_deploy', title: 'Lambda 코드 업로드', description: '`cd .../lambda` → `npm i` → `zip -r index.zip .` → `aws lambda update-function-code ...`', type: 'terminal', service: 'terminal' },
  { id: 't3_lambda_url', title: 'Lambda URL 생성', description: 'Lambda 콘솔에서 함수 URL을 생성하고(NONE 선택) URL을 복사하세요.', type: 'console', service: 'lambda' },
  { id: 't3_lambda_env', title: 'Lambda 환경변수 설정', description: 'DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, OPENAI_API_KEY를 입력하고 저장하세요.', type: 'console', service: 'lambda' },
  { id: 't3_lambda_timeout', title: 'Lambda 제한 시간 설정', description: '구성 → 일반 구성에서 제한 시간을 10분으로 변경하세요.', type: 'console', service: 'lambda' },
  { id: 't3_rebuild', title: '최종 재빌드 → S3 재업로드', description: 'client .env에 Lambda URL 입력 후 `npm run build` → `aws s3 cp` 재업로드', type: 'terminal', service: 'terminal' },
  { id: 't3_finish', title: '최종 서비스 확인', description: 'S3 엔드포인트로 접속하여 AI 메모 앱이 정상 동작하는지 확인하세요!', type: 'console', service: 's3' },
];

export const ALL_TUTORIALS = [
  { id: 1, title: 'Tutorial 1', subtitle: '만두 메뉴판 홈페이지', description: '고향만두 아저씨의 가게 소개 페이지를 S3로 인터넷에 공개합니다.', services: ['Cloud9', 'S3'], steps: TUTORIAL_1_STEPS, color: '#0073bb' },
  { id: 2, title: 'Tutorial 2', subtitle: '만두 주문 앱', description: '이제 앱에서 직접 주문받자! S3 + EC2 + RDS(MySQL) 3-tier 주문 시스템을 구축합니다.', services: ['Cloud9', 'S3', 'EC2', 'RDS'], steps: TUTORIAL_2_STEPS, color: '#d45b07' },
  { id: 3, title: 'Tutorial 3', subtitle: 'AI 만두 추천 서비스', description: '인건비 0원 AI 직원 채용! S3 + EC2 + RDS + Lambda(GPT) 서버리스 앱을 배포합니다.', services: ['Cloud9', 'S3', 'EC2', 'RDS', 'Lambda'], steps: TUTORIAL_3_STEPS, color: '#1d8102' },
];

export function useQuestState(tutorialId = 1) {
  const steps = ALL_TUTORIALS.find(t => t.id === tutorialId)?.steps || TUTORIAL_1_STEPS;
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const prevTutorialIdRef = useRef(tutorialId);

  useEffect(() => {
    if (prevTutorialIdRef.current !== tutorialId) {
      setCurrentStepIndex(0);
      setCompletedSteps([]);
      prevTutorialIdRef.current = tutorialId;
    }
  }, [tutorialId]);

  const completeCurrentStep = useCallback(() => {
    setCompletedSteps(prev => [...prev, steps[currentStepIndex].id]);
    setCurrentStepIndex(prev => Math.min(prev + 1, steps.length - 1));
  }, [currentStepIndex, steps]);

  const reset = useCallback(() => {
    setCurrentStepIndex(0);
    setCompletedSteps([]);
  }, []);

  return {
    currentStepIndex,
    currentStep: steps[currentStepIndex],
    completedSteps,
    completeCurrentStep,
    reset,
    isQuestComplete: completedSteps.length === steps.length,
    totalSteps: steps.length,
    steps,
  };
}
