#!/usr/bin/env bash
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Usage: $0 \"Post Title\" [tag1,tag2,...]"
  exit 1
fi

title="$1"
tags="${2:-}"
date_str=$(date +%Y-%m-%d)
timestamp=$(date +%Y-%m-%dT%H:%M:%S%z | sed 's/\([0-9][0-9]\)$/:\1/')
slug=$(echo "$title" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g; s/--*/-/g; s/^-//; s/-$//')
filepath="content/posts/${date_str}-${slug}.md"

if [ -f "$filepath" ]; then
  echo "File already exists: $filepath"
  exit 1
fi

tag_array="[]"
if [ -n "$tags" ]; then
  tag_array=$(echo "$tags" | tr ',' '\n' | sed 's/^ *//;s/ *$//' | awk '{printf "\"%s\", ", $0}' | sed 's/, $//')
  tag_array="[$tag_array]"
fi

cat > "$filepath" <<EOF
---
date: ${timestamp}
title: '${title}'
tags: ${tag_array}
---

EOF

echo "Created: $filepath"
