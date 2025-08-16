#!/bin/bash

# Mac Mini 통합 시스템 설치 스크립트

echo "🚀 Mac Mini M4 통합 시스템 설치 시작"

# 1. Tailscale 설치 및 설정
install_tailscale() {
    echo "📡 Tailscale 설치 중..."
    if ! command -v tailscale &> /dev/null; then
        # macOS용 Tailscale 설치
        brew install tailscale
    fi
    
    # Tailscale 시작
    sudo tailscale up --advertise-routes=192.168.1.0/24 --accept-routes
}

# 2. Docker 설치 확인
install_docker() {
    echo "🐳 Docker 설치 확인..."
    if ! command -v docker &> /dev/null; then
        brew install --cask docker
        echo "Docker를 실행한 후 다시 이 스크립트를 실행해주세요."
        exit 1
    fi
}

# 3. 각 Mac Mini별 설정
configure_mac_mini() {
    local ROLE=$1
    
    case $ROLE in
        "master")
            echo "🎛️ Master 노드 설정 중..."
            # Master 설정
            export NODE_TYPE=master
            export TAILSCALE_HOSTNAME=mac-mini-master
            ;;
        "worker1")
            echo "⚙️ Worker 1 설정 중..."
            export NODE_TYPE=worker
            export TAILSCALE_HOSTNAME=mac-mini-worker1
            export MASTER_IP=100.64.0.10
            ;;
        "worker2")
            echo "⚙️ Worker 2 설정 중..."
            export NODE_TYPE=worker
            export TAILSCALE_HOSTNAME=mac-mini-worker2
            export MASTER_IP=100.64.0.10
            ;;
    esac
}

# 4. 환경 변수 설정
setup_environment() {
    echo "🔧 환경 변수 설정 중..."
    
    cat > .env << EOF
# Tailscale
TS_AUTHKEY=tskey-auth-YOUR-KEY-HERE

# Database
POSTGRES_PASSWORD=$(openssl rand -base64 32)

# JWT
JWT_SECRET=$(openssl rand -base64 64)

# AI Services
CLAUDE_API_KEY=your-claude-api-key
GITHUB_TOKEN=your-github-token
CURSOR_TOKEN=your-cursor-token

# Supabase
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_KEY=your-supabase-service-key

# Monitoring
GRAFANA_PASSWORD=$(openssl rand -base64 16)
EOF

    echo "⚠️  .env 파일을 편집하여 실제 API 키를 입력해주세요!"
}

# 5. 통합 CLI 도구 설치
install_cli_tools() {
    echo "🛠️ CLI 도구 설치 중..."
    
    # Claude Code (이미 설치됨 가정)
    # Cursor CLI (이미 설치됨 가정)
    
    # Supabase CLI
    brew install supabase/tap/supabase
    
    # GitHub CLI
    brew install gh
}

# 6. 시스템 시작
start_system() {
    echo "🚀 시스템 시작 중..."
    
    # Docker Compose 실행
    docker-compose up -d
    
    # 헬스체크
    sleep 10
    ./health-check.sh
}

# 메인 실행 흐름
main() {
    echo "어떤 Mac Mini를 설정하시겠습니까?"
    echo "1) Master (Mac Mini #1)"
    echo "2) Worker 1 (Mac Mini #2)"
    echo "3) Worker 2 (Mac Mini #3)"
    read -p "선택 (1-3): " choice
    
    case $choice in
        1) configure_mac_mini "master";;
        2) configure_mac_mini "worker1";;
        3) configure_mac_mini "worker2";;
        *) echo "잘못된 선택입니다."; exit 1;;
    esac
    
    install_tailscale
    install_docker
    setup_environment
    install_cli_tools
    
    if [ "$NODE_TYPE" = "master" ]; then
        start_system
    else
        echo "Worker 노드 설정 완료. Master에서 연결을 기다립니다..."
    fi
    
    echo "✅ 설치 완료!"
}

# 스크립트 실행
main