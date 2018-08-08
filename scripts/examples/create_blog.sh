#!/bin/bash

API="http://localhost:4741"
URL_PATH="/blogs"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "blog": {
      "userID": "'"${USERID}"'",
      "logo": "'"${LOGO}"'",
      "headerImage": "'"${HEADERIMAGE}"'",
      "title": "'"${TITLE}"'"
    }
  }'

echo

// TOKEN=9bd1584653e2946376ac27581c662e89  USERID=5b69fd41c594365fb09cd9bc LOGO=ldjfasios HEADERIMAGE=aljfaf TITLE=uggabugga sh ./scripts/examples/create_page.sh
