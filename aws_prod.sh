rm -rf dist
rm -rf release/prod
envsubst < .env.prod > .env
yarn build
mkdir -p release/prod
cp -r dist/* release/prod