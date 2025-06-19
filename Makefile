install:
	yarn install

build:
	yarn build

# Variables for UAT
UAT_S3_BUCKET 		= s3-bucket-apse1-uat-ams-admin-portal
UAT_DISTRIBUTION_ID = E1FYJRPSKTJ5P5

# Deploy application for stage UAT
uat.deploy: 
	cd release/uat/ && \
	aws s3 cp . s3://$(UAT_S3_BUCKET) --recursive --include '*' && aws cloudfront create-invalidation --distribution-id $(UAT_DISTRIBUTION_ID) --paths '/*'

# Variables for PROD
PROD_S3_BUCKET 		 = s3-bucket-apse1-uat-ams-admin-portal
PROD_DISTRIBUTION_ID = E1FYJRPSKTJ5P5

# Deploy application for stage PROD
prod.deploy: 
	cd release/prod/ && \
	aws s3 cp . s3://$(PROD_S3_BUCKET) --recursive --include '*' && aws cloudfront create-invalidation --distribution-id $(PROD_DISTRIBUTION_ID) --paths '/*'