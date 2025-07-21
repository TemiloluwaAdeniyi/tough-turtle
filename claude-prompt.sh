#!/bin/bash
source .env
curl "$ANTHROPIC_BASE_URL/v1/messages" \
  -H "Authorization: Bearer $ANTHROPIC_AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"model\": \"claude-3-sonnet\",
    \"messages\": [{\"role\": \"user\", \"content\": \"$*\"}],
    \"max_tokens\": 1000
  }" --output - | jq .
