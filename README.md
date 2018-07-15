## 역할
1. RESTful API with AWS Lambda via Serverless
2. Full Documentation with OpenAPI

## 사전준비

### Serverless 설치
```
npm install serverless --global # 또는 npm i serverless -g
```

### AWS Key 등록

1. Access Key와 Secret Key를 공용 구글 문서를 참고하여 취득
2. [Guide to Setup AWS Credentials](https://serverless.com/framework/docs/providers/aws/guide/credentials#using-aws-profiles) 페이지를 참고하여 설정


## Lambda 를 수정하고 반영하는 방법

1. serverless.yml 수정 및 관련 js 코드 수정

2. 배포
    ```
    serverless deploy # 또는 npm run deploy-lambda
    ```

## OpenAPI 를 수정하고 반영하는 방법

1. vscode에서 install extension으로  openapi-viewer 설치

2. client/dist/openapi.yml 수정 (openapi-viewer로 고치면서 작성)

3. 배포
    ```
    serverless client deploy # 또는 npm run deploy-openapi
    ```