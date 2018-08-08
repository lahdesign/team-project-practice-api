#!/bin/bash

API="http://localhost:4741"
URL_PATH="/pages"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "page": {
      "photo": "'"${PHOTO}"'",
      "description": "'"${DESCRIPTION}"'",
      "title": "'"${TITLE}"'"
    }
  }'

echo

// TOKEN= PHOTO="http://imgur.com/jjakfkladf" DESCRIPTION="A description" TITLE=first sh ./ scripts/examples/create_pages.sh
