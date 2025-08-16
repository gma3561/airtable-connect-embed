#!/bin/bash
# Cursor Agent 설치 스크립트 (Docker 컨테이너용)

echo "Installing Cursor Agent in container..."

# Install curl if not present
if ! command -v curl &> /dev/null; then
    apt-get update && apt-get install -y curl
fi

# Install Cursor Agent
curl https://cursor.com/install -fsS | bash

# Add to PATH for all users
echo 'export PATH="$HOME/.local/bin:$PATH"' >> /etc/profile.d/cursor-agent.sh
chmod +x /etc/profile.d/cursor-agent.sh

# Verify installation
export PATH="$HOME/.local/bin:$PATH"
cursor-agent --version

echo "Cursor Agent installation complete!"