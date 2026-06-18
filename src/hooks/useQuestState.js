import { useState, useCallback, useEffect, useRef } from 'react';

// ─── 크레딧 시스템 ───
export const INITIAL_CREDITS = 100;

// 스텝 완료 시 차감 비용
export const STEP_CREDIT_COSTS = {
  header:   0,    // 리전 설정은 무료
  cloud9:   5,
  terminal: 1,
  s3:       2,
  ec2:      8,
  rds:      12,
  lambda:   1,
};

// 실수 이벤트 정의
export const MISTAKE_EVENTS = {
  api_key_exposed:   { label: '🚨 API 키가 GitHub에 노출됐어요!', penalty: 30, message: '해킹당했다...!!! 누군가 내 계정으로 서버를 막 만들고 있어요 😱' },
  ec2_left_on:       { label: '⚠️ EC2를 끄지 않고 방치했어요!', penalty: 8,  message: '...뭔가 돈이 새고 있어. 쓰지 않는 서버는 꺼야 해요 😟' },
  security_group_open: { label: '⚠️ 보안그룹이 전체 공개됐어요!', penalty: 15, message: '누구나 내 서버에 들어올 수 있잖아?! 0.0.0.0/0은 위험해요 😰' },
  wrong_region:      { label: '⚠️ 리전을 잘못 설정했어요!', penalty: 5,  message: '서울인 줄 알았는데 버지니아였어... 리전마다 요금이 달라요 😅' },
};

// 크레딧 → 감정 매핑
export function getMoodFromCredits(credits, combo) {
  if (combo <= -2) return 'worried';
  if (combo >= 3 && credits >= 70) return 'ecstatic';
  if (credits >= 75) return 'ecstatic';
  if (credits >= 50) return 'happy';
  if (credits >= 25) return 'determined';
  if (credits >= 10) return 'worried';
  return 'crisis';
}

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
    description: '아래 JSON을 복사해 권한 탭 → 버킷 정책 편집에 붙여넣고, <YOUR_BUCKET_ARN> 부분을 에디터 상단 ARN으로 교체한 뒤 저장하세요.',
    template: `{\n  "Version": "2012-10-17",\n  "Statement": [{\n    "Effect": "Allow",\n    "Principal": "*",\n    "Action": "s3:GetObject",\n    "Resource": "<YOUR_BUCKET_ARN>/*"\n  }]\n}`,
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
  {
    id: 't2_region', title: '리전 설정', type: 'console', service: 'header',
    description: '우측 상단 리전을 "서울 (ap-northeast-2)"로 설정하세요.',
    why: 'Tutorial 2는 EC2 서버와 RDS 데이터베이스를 새로 만들어요. 이 서비스들도 서울 리전에 있어야 같은 리전 내에서 낮은 지연시간으로 통신할 수 있어요.',
    concept: '리전 = 물리적 데이터센터 묶음. 같은 리전 내 서비스끼리 통신이 더 빠르고 저렴해요.',
  },
  {
    id: 't2_c9_create', title: 'Cloud9 환경 생성', type: 'console', service: 'cloud9',
    description: 'Cloud9을 검색하고 t3.small로 새 환경을 생성하세요.',
    why: 'Cloud9은 이번 실습의 개발 환경이에요. EC2, RDS와 같은 리전에 있어야 내부 네트워크로 안전하게 통신할 수 있어요.',
    concept: 'Cloud9 = AWS 관리형 개발 환경. 실제로는 EC2 인스턴스가 생성되며 AWS CLI가 사전 설치되어 있어요.',
  },
  {
    id: 't2_c9_open', title: 'Cloud9 IDE 열기', type: 'console', service: 'cloud9',
    description: '"열림" 버튼을 눌러 터미널에 진입하세요.',
    why: '생성된 Cloud9 환경에서 터미널을 열어야 코드 실행과 AWS CLI 명령어를 사용할 수 있어요.',
    concept: 'IDE = 통합 개발 환경. Cloud9은 코드 편집기 + 터미널 + 파일 탐색기가 합쳐진 브라우저 기반 IDE예요.',
  },
  {
    id: 't2_clone', title: '실습 코드 다운로드', type: 'terminal', service: 'terminal',
    description: '`git clone https://github.com/nxtcloud-org/Nxt-Classic-Architecture.git`',
    why: '실습에 필요한 프론트엔드(client)와 백엔드(server) 코드를 GitHub에서 EC2 서버로 가져와요. 이번 튜토리얼은 두 폴더를 모두 사용해요.',
    concept: 'git clone = 원격 저장소의 전체 코드를 현재 서버로 복사하는 명령어예요.',
  },
  {
    id: 't2_cd_client', title: 'client 폴더로 이동', type: 'terminal', service: 'terminal',
    description: '`cd /home/ec2-user/environment/Nxt-Classic-Architecture/2.RandomTextApp/client`',
    why: 'RandomTextApp 안에 client(프론트엔드)와 server(백엔드) 폴더가 분리되어 있어요. 먼저 client 폴더에서 화면을 빌드해야 해요.',
    concept: '프론트엔드(client) = 사용자 브라우저에서 실행되는 화면 코드. 백엔드(server)와 역할이 완전히 달라요.',
  },
  {
    id: 't2_npm_install_client', title: 'client 종속성 설치', type: 'terminal', service: 'terminal',
    description: '`npm install`',
    why: 'client 코드도 React 기반이라 수백 개의 라이브러리가 필요해요. package.json에 목록만 있으니 실제 파일을 다운로드해야 해요.',
    concept: 'npm install = package.json에 선언된 종속성을 node_modules 폴더에 실제로 설치하는 명령어예요.',
  },
  {
    id: 't2_npm_build_client', title: 'client 빌드', type: 'terminal', service: 'terminal',
    description: '`npm run build`',
    why: 'React JSX 코드를 브라우저가 읽을 수 있는 HTML/CSS/JS로 변환해요. 빌드 결과물(build/)이 S3에 올라갈 파일이에요.',
    concept: '빌드 = 소스코드를 배포 가능한 정적 파일로 변환하는 과정. 나중에 서버 URL을 바꾸면 재빌드가 필요해요.',
  },
  {
    id: 't2_s3_create', title: 'S3 버킷 생성', type: 'console', service: 's3',
    description: '버킷을 생성하세요. 퍼블릭 액세스 차단을 반드시 해제해야 합니다.',
    why: '3-tier 앱에서 프론트엔드는 S3로 호스팅하고 백엔드는 EC2가 담당해요. 먼저 S3에 화면 파일을 올릴 공간을 만들어야 해요.',
    concept: 'S3 = 정적 파일 호스팅에 최적화된 스토리지. EC2 없이 HTML/JS/CSS만 서빙할 때 가장 저렴한 선택이에요.',
  },
  {
    id: 't2_s3_policy', title: 'S3 버킷 정책 설정', type: 'console', service: 's3',
    description: '아래 JSON을 복사해 권한 탭 → 버킷 정책 편집에 붙여넣고, <YOUR_BUCKET_ARN>을 에디터 상단 ARN으로 교체 후 저장하세요.',
    template: `{\n  "Version": "2012-10-17",\n  "Statement": [{\n    "Effect": "Allow",\n    "Principal": "*",\n    "Action": "s3:GetObject",\n    "Resource": "<YOUR_BUCKET_ARN>/*"\n  }]\n}`,
    why: '퍼블릭 액세스를 해제했어도 실제 읽기 권한은 별도 정책에서 허용해야 해요. 정책이 없으면 버킷의 파일에 외부에서 접근할 수 없어요.',
    concept: 'IAM 버킷 정책 = JSON으로 정의하는 접근 규칙. Effect·Principal·Action·Resource 4가지로 권한을 표현해요.',
  },
  {
    id: 't2_s3_hosting', title: '정적 웹 호스팅 활성화', type: 'console', service: 's3',
    description: '속성 탭에서 정적 웹 사이트 호스팅을 활성화하세요.',
    why: '웹 호스팅 모드를 켜야 S3가 index.html을 기본 진입점으로 서빙해요. 이 모드 없이는 파일이 있어도 웹사이트로 접근할 수 없어요.',
    concept: '정적 웹 호스팅 = S3 버킷이 웹 서버처럼 동작하도록 활성화하는 기능. 고유 엔드포인트 URL이 생성돼요.',
  },
  {
    id: 't2_s3_cp_client', title: 'client build → S3 업로드', type: 'terminal', service: 'terminal',
    description: '`aws s3 cp build s3://<버킷명> --recursive`',
    why: '빌드된 파일이 EC2 서버에만 있어요. AWS CLI로 build/ 폴더 전체를 S3에 올려야 웹에서 접근할 수 있어요.',
    concept: 'aws s3 cp --recursive = 로컬 폴더의 모든 파일을 S3에 업로드하는 AWS CLI 명령어예요.',
  },
  {
    id: 't2_rds_create', title: 'RDS 데이터베이스 생성', type: 'console', service: 'rds',
    description: 'RDS를 검색하고 MySQL, 프리티어, 퍼블릭 액세스 = 예로 DB를 생성하세요.',
    why: '이번 앱은 주문 데이터를 저장해야 해요. EC2에 DB를 직접 설치할 수도 있지만, RDS를 쓰면 백업·패치·고가용성을 AWS가 자동으로 관리해줘요.',
    concept: 'RDS = AWS 관리형 관계형 DB 서비스. EC2에 MySQL을 직접 설치하는 것과 달리 운영 부담이 거의 없어요.',
  },
  {
    id: 't2_sg_rds', title: '보안그룹 인바운드 규칙 추가 (3306)', type: 'console', service: 'ec2',
    description: '생성된 DB의 보안 그룹에서 MySQL/Aurora (3306) 인바운드 규칙을 추가하세요.',
    why: 'AWS 보안그룹은 기본적으로 모든 인바운드 트래픽을 차단해요. EC2 서버가 RDS(3306 포트)에 접속하려면 명시적으로 허용해야 해요.',
    concept: '보안그룹 = AWS 방화벽. 포트·IP 단위로 인바운드(들어오는)/아웃바운드(나가는) 트래픽을 제어해요.',
  },
  {
    id: 't2_mysql_connect', title: 'MySQL 접속', type: 'terminal', service: 'terminal',
    description: '`mysql -h <RDS endpoint> -P 3306 -u <username> -p`',
    why: 'RDS에 DB와 테이블을 직접 만들어야 앱이 데이터를 저장할 수 있어요. 먼저 MySQL 클라이언트로 접속해야 해요.',
    concept: 'MySQL = 관계형 데이터베이스. 데이터를 표(테이블) 형태로 저장하고 SQL로 조회·수정해요.',
  },
  {
    id: 't2_create_db', title: 'Database 생성', type: 'terminal', service: 'terminal',
    description: '`CREATE DATABASE texts;`',
    why: '앱이 사용할 데이터베이스(texts)를 명시적으로 생성해야 해요. 테이블은 서버가 처음 실행될 때 자동으로 만들어줘요.',
    concept: 'CREATE DATABASE = 새 데이터베이스 공간을 만드는 SQL 명령어. MySQL 서버 안에 여러 DB가 공존할 수 있어요.',
  },
  {
    id: 't2_mysql_exit', title: 'MySQL 종료', type: 'terminal', service: 'terminal',
    description: '`EXIT;`',
    why: 'MySQL 접속을 닫아야 터미널이 다시 일반 쉘로 돌아와요. 이후 Node.js 서버 실행을 위해 서버 폴더로 이동해야 해요.',
    concept: 'EXIT; = MySQL 세션을 안전하게 종료하는 명령어. 그냥 창을 닫으면 커넥션이 남아 문제가 생길 수 있어요.',
  },
  {
    id: 't2_cd_server', title: 'server 폴더로 이동', type: 'terminal', service: 'terminal',
    description: '`cd /home/ec2-user/environment/Nxt-Classic-Architecture/2.RandomTextApp/server`',
    why: '이제 백엔드 API 서버를 설정할 차례예요. server 폴더에는 EC2에서 실행되는 Node.js 코드가 있어요.',
    concept: '백엔드(server) = 데이터베이스와 통신하고 API를 제공하는 서버 코드. 클라이언트가 직접 DB에 접근하지 않고 서버를 통해 데이터를 요청해요.',
  },
  {
    id: 't2_npm_install_server', title: 'server 종속성 설치', type: 'terminal', service: 'terminal',
    description: '`npm install`',
    why: 'server 폴더도 express, mysql2 등 외부 패키지를 사용해요. 서버 코드를 실행하기 전에 종속성을 먼저 설치해야 해요.',
    concept: 'Express = Node.js 기반 웹 서버 프레임워크. HTTP 요청을 받아 처리하고 응답을 돌려주는 역할을 해요.',
  },
  {
    id: 't2_env_server', title: 'server .env 파일 수정', type: 'console', service: 'cloud9',
    description: '.env.example → .env로 이름 변경 후 DB 접속 정보를 입력하세요.',
    why: 'DB 접속 정보(호스트·사용자명·비밀번호)를 코드에 직접 쓰면 GitHub에 올라갔을 때 유출될 위험이 있어요. .env 파일로 분리해야 해요.',
    concept: '.env 파일 = 환경변수를 저장하는 파일. 코드와 설정을 분리하는 보안 기본 원칙이에요. .gitignore에 추가해 절대 저장소에 올리지 않아요.',
  },
  {
    id: 't2_node_server', title: '서버 실행', type: 'terminal', service: 'terminal',
    description: '`node server.js`',
    why: 'Node.js 서버를 실행해야 API 엔드포인트가 열려요. 이 서버가 클라이언트(S3)와 데이터베이스(RDS) 사이에서 중간 다리 역할을 해요.',
    concept: 'Node.js = JavaScript로 서버를 실행하는 런타임. `node server.js`로 서버를 시작하면 설정한 포트(8080)에서 요청을 기다려요.',
  },
  {
    id: 't2_sg_ec2', title: '보안그룹 인바운드 규칙 추가 (8080)', type: 'console', service: 'ec2',
    description: 'EC2 → 보안그룹에서 사용자 지정 TCP (8080) 인바운드 규칙을 추가하세요.',
    why: 'EC2 서버의 8080 포트로 API 요청이 들어올 수 있도록 보안그룹에서 열어줘야 해요. 포트를 열지 않으면 브라우저에서 서버에 접근할 수 없어요.',
    concept: '포트 = 서버 안에서 특정 서비스가 사용하는 논리적 통로. 8080은 개발 서버에서 많이 쓰는 포트번호예요.',
  },
  {
    id: 't2_client_env', title: 'client .env 파일 수정', type: 'console', service: 'cloud9',
    description: 'client .env에 REACT_APP_SERVER_URL=http://<EC2 IP>:8080 을 입력하세요.',
    why: '프론트엔드(S3)가 어느 서버로 API를 보낼지 알아야 해요. EC2의 퍼블릭 IP와 포트를 .env에 설정해야 연결이 돼요.',
    concept: '환경변수 = 빌드 시 주입되는 외부 설정값. React에서 REACT_APP_ 접두사 변수는 빌드 결과물에 포함돼요.',
  },
  {
    id: 't2_rebuild', title: 'client 재빌드 → S3 재업로드', type: 'terminal', service: 'terminal',
    description: '`npm run build` 후 `aws s3 cp build s3://<버킷명> --recursive`',
    why: 'client .env를 수정했으니 다시 빌드해야 변경사항이 반영돼요. 새 빌드 파일을 S3에 재업로드해야 브라우저에서 실제 서버와 연결돼요.',
    concept: '재빌드 = 환경변수는 빌드 타임에 코드에 삽입돼요. .env를 바꿔도 재빌드 없이는 반영되지 않아요.',
  },
  {
    id: 't2_finish', title: '앱 연결 확인', type: 'console', service: 's3',
    description: 'S3 엔드포인트 URL에서 랜덤 명언이 출력되는 것을 확인하세요!',
    why: 'S3(프론트엔드) → EC2(백엔드 API) → RDS(데이터베이스) 세 계층이 모두 연결됐어요. 화면에서 데이터가 나오면 3-tier 아키텍처 완성이에요!',
    concept: '3-tier 아키텍처 = 화면(Presentation)·비즈니스 로직(Logic)·데이터(Data) 계층을 분리한 구조. 확장성과 유지보수성이 뛰어나요.',
  },
];

// ─── Tutorial 3: AI Note App (S3 + EC2 서버 + RDS + Lambda) ───
export const TUTORIAL_3_STEPS = [
  {
    id: 't3_region', title: '리전 설정', type: 'console', service: 'header',
    description: '우측 상단 리전을 "서울 (ap-northeast-2)"로 설정하세요.',
    why: 'Tutorial 3는 S3·EC2·RDS·Lambda 네 가지 서비스가 모두 서울 리전에서 통신해요. 서비스들이 같은 리전에 있어야 내부망으로 빠르게 연결돼요.',
    concept: '리전 = 물리적 데이터센터 묶음. 리전 간 통신은 추가 요금과 지연이 발생하므로 같은 리전에 배치해요.',
  },
  {
    id: 't3_s3_create', title: 'S3 버킷 생성', type: 'console', service: 's3',
    description: '버킷을 생성하세요. 퍼블릭 액세스 차단을 해제해야 합니다.',
    why: 'Tutorial 3는 서버리스 아키텍처라 Lambda가 AI 처리를 담당해요. 프론트엔드는 Tutorial 2처럼 S3로 호스팅해요. 먼저 파일 저장 공간을 만들어요.',
    concept: 'S3 = 정적 파일 호스팅에 최적화된 스토리지. 서버리스 아키텍처의 프론트엔드를 담당하는 가장 기본 서비스예요.',
  },
  {
    id: 't3_s3_hosting', title: '정적 웹 호스팅 활성화', type: 'console', service: 's3',
    description: '속성 탭에서 정적 웹 사이트 호스팅을 활성화하세요.',
    why: '버킷을 웹 서버처럼 동작시켜야 해요. 호스팅 모드 없이는 브라우저에서 S3 URL로 접근해도 파일 목록만 보여요.',
    concept: '정적 웹 호스팅 = S3가 index.html을 기본 진입점으로 서빙하도록 활성화하는 설정이에요.',
  },
  {
    id: 't3_s3_policy', title: 'S3 버킷 정책 설정', type: 'console', service: 's3',
    description: '아래 JSON을 복사해 권한 탭 → 버킷 정책 편집에 붙여넣고, <YOUR_BUCKET_ARN>을 에디터 상단 ARN으로 교체 후 저장하세요.',
    template: `{\n  "Version": "2012-10-17",\n  "Statement": [{\n    "Effect": "Allow",\n    "Principal": "*",\n    "Action": "s3:GetObject",\n    "Resource": "<YOUR_BUCKET_ARN>/*"\n  }]\n}`,
    why: '버킷 정책이 없으면 외부에서 파일을 읽을 수 없어요. GetObject 권한을 모든 사용자(*)에게 허용해야 웹사이트가 정상적으로 로드돼요.',
    concept: 'IAM 버킷 정책 = JSON으로 접근 권한을 정의하는 규칙. 퍼블릭 액세스 해제 + 버킷 정책 추가 두 단계가 모두 필요해요.',
  },
  {
    id: 't3_c9_create', title: 'Cloud9 환경 생성', type: 'console', service: 'cloud9',
    description: 'Cloud9을 검색하고 t3.small로 새 환경을 생성하세요.',
    why: 'Lambda 코드 패키징과 S3 업로드 등 AWS CLI 작업이 필요해요. Cloud9은 AWS CLI가 사전 설치된 개발 환경이라 별도 설정 없이 바로 사용할 수 있어요.',
    concept: 'Cloud9 = 브라우저 기반 AWS 개발 환경. EC2 인스턴스가 자동 생성되며 Lambda 배포에 필요한 zip, npm 등이 모두 있어요.',
  },
  {
    id: 't3_c9_open', title: 'Cloud9 IDE 열기', type: 'console', service: 'cloud9',
    description: '"열림" 버튼을 눌러 터미널에 진입하세요.',
    why: 'Cloud9 환경을 열어야 터미널에서 명령어를 실행할 수 있어요. 이 터미널은 실제 EC2 서버 위에서 실행되는 리눅스 쉘이에요.',
    concept: 'IDE 터미널 = 개발 환경의 명령줄 인터페이스. 코드 편집부터 AWS CLI 명령어까지 모두 이 터미널에서 실행해요.',
  },
  {
    id: 't3_clone', title: '실습 코드 다운로드', type: 'terminal', service: 'terminal',
    description: '`git clone https://github.com/nxtcloud-org/Nxt-Classic-Architecture.git`',
    why: 'Tutorial 3의 client, server, lambda 세 폴더가 모두 이 저장소 안에 있어요. git clone으로 한 번에 전체를 가져올 수 있어요.',
    concept: 'git clone = GitHub 저장소를 현재 서버에 복사하는 명령어. 이후 cd로 원하는 폴더로 이동해서 작업해요.',
  },
  {
    id: 't3_cd_client', title: 'serverless/client 폴더로 이동', type: 'terminal', service: 'terminal',
    description: '`cd ~/environment/Nxt-Classic-Architecture/3.AiNoteApp/serverless/client`',
    why: 'AI Note App은 serverless 폴더 아래에 client와 server가 분리돼 있어요. 먼저 화면 코드를 빌드하기 위해 client 폴더로 이동해요.',
    concept: '디렉토리 구조 = 프로젝트 내 폴더 계층. 역할별로 코드를 분리하면 각 부분을 독립적으로 빌드·배포할 수 있어요.',
  },
  {
    id: 't3_npm_install', title: 'client 종속성 설치', type: 'terminal', service: 'terminal',
    description: '`npm install`',
    why: 'client도 React 기반이라 외부 라이브러리가 필요해요. package.json에 나열된 종속성을 실제로 다운로드해야 빌드가 가능해요.',
    concept: 'npm install = package.json에 명시된 모든 패키지를 node_modules에 설치하는 명령어예요.',
  },
  {
    id: 't3_npm_build', title: 'client 빌드', type: 'terminal', service: 'terminal',
    description: '`npm run build`',
    why: 'React 소스코드를 브라우저가 실행할 수 있는 HTML/CSS/JS로 변환해요. Lambda URL이 확정된 후 .env에 넣고 다시 빌드할 거예요.',
    concept: '빌드 = 개발용 소스코드를 최적화된 배포용 파일로 변환하는 과정이에요.',
  },
  {
    id: 't3_s3_cp', title: 'build → S3 업로드', type: 'terminal', service: 'terminal',
    description: '`aws s3 cp build s3://<버킷명> --recursive`',
    why: 'S3가 웹에 파일을 서빙하려면 빌드 결과물이 S3에 있어야 해요. --recursive로 build/ 폴더 전체를 한 번에 업로드해요.',
    concept: 'aws s3 cp --recursive = 지정된 폴더의 모든 파일을 S3에 복사하는 AWS CLI 명령어예요.',
  },
  {
    id: 't3_rds_create', title: 'RDS 데이터베이스 생성', type: 'console', service: 'rds',
    description: 'RDS를 검색하고 MySQL, 프리티어로 DB를 생성하세요.',
    why: 'AI Note App은 메모 데이터를 DB에 저장해요. Lambda도 이 RDS에 접근해야 하므로, VPC 내에서 통신 가능한 위치에 DB를 만들어야 해요.',
    concept: 'RDS = AWS 관리형 관계형 DB. MySQL을 EC2에 직접 설치하는 대신 AWS가 백업·패치를 자동으로 관리해줘요.',
  },
  {
    id: 't3_sg_rds', title: '보안그룹 인바운드 (3306)', type: 'console', service: 'ec2',
    description: 'DB 보안 그룹에서 MySQL/Aurora (3306) 인바운드 규칙을 추가하세요.',
    why: 'EC2 서버와 Lambda가 RDS에 접속하려면 3306 포트가 열려 있어야 해요. 보안그룹 규칙이 없으면 연결 시도 자체가 차단돼요.',
    concept: '보안그룹 인바운드 규칙 = 외부에서 이 리소스로 들어오는 트래픽을 허용하는 설정. 포트와 소스(IP)를 지정해요.',
  },
  {
    id: 't3_mysql_db', title: 'DB 생성 (MySQL)', type: 'terminal', service: 'terminal',
    description: '`mysql -h <RDS endpoint> ...` → `CREATE DATABASE db_xxx;` → `EXIT;`',
    why: '앱이 사용할 데이터베이스를 직접 생성해야 해요. 서버가 처음 실행될 때 테이블을 자동으로 만들지만, DB 자체는 먼저 존재해야 해요.',
    concept: 'CREATE DATABASE = 새 데이터베이스 네임스페이스를 만드는 SQL 명령어예요.',
  },
  {
    id: 't3_env_files', title: '.env 파일 수정', type: 'console', service: 'cloud9',
    description: 'server/.env 및 client/.env에 DB 정보와 서버 URL을 입력하세요.',
    why: 'server는 DB 접속 정보, client는 나중에 Lambda URL이 필요해요. .env 파일로 설정값을 코드와 분리해 보안을 지키면서 유연하게 변경할 수 있어요.',
    concept: '환경변수 파일(.env) = 보안 정보와 설정값을 코드 외부에 보관하는 방법. .gitignore로 저장소에 절대 올리지 않아요.',
  },
  {
    id: 't3_sg_ec2', title: '보안그룹 인바운드 (80)', type: 'console', service: 'ec2',
    description: 'EC2 보안그룹에서 HTTP (80) 인바운드 규칙을 추가하세요.',
    why: 'EC2 서버가 HTTP(80 포트)로 API 요청을 받으려면 보안그룹에서 해당 포트를 열어야 해요. Tutorial 2의 8080 대신 80을 쓰면 URL에 포트 번호를 안 써도 돼요.',
    concept: 'HTTP 포트 80 = 웹 브라우저가 기본으로 사용하는 포트. 포트를 URL에 따로 안 써도 돼서 주소가 깔끔해요.',
  },
  {
    id: 't3_cd_server', title: 'serverless/server 폴더로 이동', type: 'terminal', service: 'terminal',
    description: '`cd ~/environment/Nxt-Classic-Architecture/3.AiNoteApp/serverless/server`',
    why: '백엔드 API 서버 코드가 serverless/server 폴더에 있어요. 서버를 실행하기 전에 먼저 해당 폴더로 이동해야 해요.',
    concept: '서버 코드 = 클라이언트 요청을 받아 DB에서 데이터를 읽거나 쓰는 비즈니스 로직이 담긴 코드예요.',
  },
  {
    id: 't3_server_run', title: '서버 실행', type: 'terminal', service: 'terminal',
    description: '`npm install` 후 `sudo node server.js`',
    why: 'EC2 서버가 API 요청을 받으려면 Node.js 프로세스가 실행 중이어야 해요. sudo는 80 포트를 사용하기 위해 관리자 권한이 필요하기 때문이에요.',
    concept: 'sudo = 관리자(root) 권한으로 명령어를 실행하는 접두사. 1024 이하 포트는 root 권한 없이 열 수 없어요.',
  },
  {
    id: 't3_lambda_create', title: 'Lambda 함수 생성', type: 'console', service: 'lambda',
    description: 'Lambda를 검색하고 함수를 생성하세요. (이름 설정, 기존 역할 사용)',
    why: 'AI 추천 기능은 OpenAI API를 호출하는 무거운 작업이에요. Lambda를 쓰면 이 작업만 서버리스로 분리해서 필요할 때만 실행하고 비용도 아낄 수 있어요.',
    concept: 'Lambda = 서버 없이 코드를 실행하는 서버리스 서비스. 요청이 있을 때만 실행되고 실행 시간(ms)만큼만 과금해요.',
  },
  {
    id: 't3_lambda_deploy', title: 'Lambda 코드 업로드', type: 'terminal', service: 'terminal',
    description: '`cd .../lambda` → `npm i` → `zip -r index.zip .` → `aws lambda update-function-code ...`',
    why: 'Lambda는 zip으로 압축된 코드 파일을 업로드하는 방식이에요. npm install로 node_modules까지 포함해서 압축해야 런타임에서 패키지를 찾을 수 있어요.',
    concept: 'Lambda 배포 패키지 = 코드 + 종속성을 zip으로 묶은 파일. AWS가 이 파일을 받아 격리된 컨테이너에서 실행해요.',
  },
  {
    id: 't3_lambda_url', title: 'Lambda URL 생성', type: 'console', service: 'lambda',
    description: 'Lambda 콘솔에서 함수 URL을 생성하고(NONE 선택) URL을 복사하세요.',
    why: 'Lambda 함수 URL은 API Gateway 없이 Lambda를 직접 HTTP로 호출할 수 있는 고유 엔드포인트예요. 클라이언트가 이 URL로 AI 추천을 요청해요.',
    concept: 'Lambda 함수 URL = Lambda를 HTTP 엔드포인트로 노출하는 기능. NONE(인증 없음)으로 설정하면 누구나 호출할 수 있어요.',
  },
  {
    id: 't3_lambda_env', title: 'Lambda 환경변수 설정', type: 'console', service: 'lambda',
    description: 'DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, OPENAI_API_KEY를 입력하고 저장하세요.',
    why: 'Lambda 코드 안에 DB 접속 정보나 API 키를 하드코딩하면 안 돼요. Lambda 환경변수로 설정하면 코드 변경 없이 값을 바꿀 수 있고 보안도 지킬 수 있어요.',
    concept: 'Lambda 환경변수 = 함수 실행 시 주입되는 외부 설정값. process.env.변수명으로 코드에서 접근해요.',
  },
  {
    id: 't3_lambda_timeout', title: 'Lambda 제한 시간 설정', type: 'console', service: 'lambda',
    description: '구성 → 일반 구성에서 제한 시간을 10분으로 변경하세요.',
    why: 'Lambda 기본 제한 시간은 3초예요. OpenAI API 응답에 수십 초가 걸릴 수 있으니, 타임아웃을 넉넉하게 늘려야 AI 응답이 중간에 끊기지 않아요.',
    concept: 'Lambda 타임아웃 = 함수 최대 실행 시간. 이 시간을 넘기면 강제 종료돼요. AI API처럼 느린 외부 호출은 길게 설정해야 해요.',
  },
  {
    id: 't3_rebuild', title: '최종 재빌드 → S3 재업로드', type: 'terminal', service: 'terminal',
    description: 'client .env에 Lambda URL 입력 후 `npm run build` → `aws s3 cp` 재업로드',
    why: 'Lambda URL이 확정됐으니 client .env에 넣고 다시 빌드해야 해요. 프론트엔드가 이 URL로 AI 추천을 요청하는 코드가 빌드 결과물에 포함돼요.',
    concept: '환경변수 반영 = 빌드 타임에 .env 값이 번들에 삽입돼요. Lambda URL처럼 뒤늦게 확정된 값은 마지막 재빌드로 적용해요.',
  },
  {
    id: 't3_finish', title: '최종 서비스 확인', type: 'console', service: 's3',
    description: 'S3 엔드포인트로 접속하여 AI 메모 앱이 정상 동작하는지 확인하세요!',
    why: 'S3(화면) → EC2(서버) → RDS(데이터) → Lambda(AI) 네 계층이 모두 연결됐어요. 메모를 입력하고 AI 추천이 나오면 서버리스 AI 앱 구축 완성이에요!',
    concept: '서버리스 아키텍처 = AI 같은 특정 기능만 Lambda로 분리해 서버 없이 운영하는 구조. 트래픽이 없으면 비용도 없어요.',
  },
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
  const [credits, setCredits] = useState(INITIAL_CREDITS);
  const [combo, setCombo] = useState(0);
  const [lastEvent, setLastEvent] = useState(null);
  const prevTutorialIdRef = useRef(tutorialId);

  useEffect(() => {
    if (prevTutorialIdRef.current !== tutorialId) {
      setCurrentStepIndex(0);
      setCompletedSteps([]);
      setCredits(INITIAL_CREDITS);
      setCombo(0);
      setLastEvent(null);
      prevTutorialIdRef.current = tutorialId;
    }
  }, [tutorialId]);

  const completeStep = useCallback((stepId) => {
    if (completedSteps.includes(stepId)) return;

    // 순서 강제: 현재 차례 스텝만 완료 가능
    const currentStep = steps[currentStepIndex];
    if (!currentStep || stepId !== currentStep.id) return;

    const step = steps.find(s => s.id === stepId);
    if (!step) return;

    const cost = STEP_CREDIT_COSTS[step?.service] ?? 1;
    const newCombo = combo >= 0 ? combo + 1 : 1;
    const bonus = newCombo === 3 ? 5 : newCombo === 5 ? 8 : 0;

    setCredits(prev => Math.min(100, Math.max(0, prev - cost + bonus)));
    setCombo(newCombo);
    setLastEvent({
      type: 'success',
      message: bonus > 0 ? `연속 ${newCombo}회 성공! 크레딧 +$${bonus} 보너스 🎉` : null,
      delta: -cost + bonus,
    });
    setCompletedSteps(prev => [...prev, stepId]);

    // currentStepIndex를 다음 미완료 스텝으로 자동 이동
    const newCompleted = [...completedSteps, stepId];
    const nextIndex = steps.findIndex(s => !newCompleted.includes(s.id));
    if (nextIndex !== -1) setCurrentStepIndex(nextIndex);
  }, [completedSteps, steps, combo, currentStepIndex]);

  const completeCurrentStep = useCallback(() => {
    const step = steps[currentStepIndex];
    if (step) completeStep(step.id);
  }, [currentStepIndex, steps, completeStep]);

  const debugClearAll = useCallback(() => {
    setCompletedSteps(steps.map(s => s.id));
    setCurrentStepIndex(steps.length);
    setCredits(INITIAL_CREDITS);
    setCombo(0);
    setLastEvent(null);
  }, [steps]);

  const triggerMistake = useCallback((mistakeKey) => {
    const event = MISTAKE_EVENTS[mistakeKey];
    if (!event) return;
    const newCombo = combo <= 0 ? combo - 1 : -1;
    setCredits(prev => Math.max(0, prev - event.penalty));
    setCombo(newCombo);
    setLastEvent({ type: 'mistake', message: event.message, delta: -event.penalty, label: event.label });
  }, [combo]);

  const reset = useCallback(() => {
    setCurrentStepIndex(0);
    setCompletedSteps([]);
    setCredits(INITIAL_CREDITS);
    setCombo(0);
    setLastEvent(null);
  }, []);

  const mood = getMoodFromCredits(credits, combo);

  return {
    currentStepIndex,
    currentStep: steps[currentStepIndex],
    completedSteps,
    completeStep,
    completeCurrentStep,
    triggerMistake,
    reset,
    debugClearAll,
    isQuestComplete: completedSteps.length === steps.length,
    totalSteps: steps.length,
    steps,
    credits,
    combo,
    mood,
    lastEvent,
  };
}
