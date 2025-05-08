envsubst < .env.uat > .env
yarn build
mkdir -p release/uat
cp -r dist/* release/uat
git add .
git commit -m "chore: build and deploy to uat"
git push
