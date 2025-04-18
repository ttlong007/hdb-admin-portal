envsubst < .env.uat > .env
yarn build
mkdir -p release/uat
cp -r dist/* release/uat