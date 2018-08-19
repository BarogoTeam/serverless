# 백엔드

## 역할
1. RESTful API with AWS Lambda via Serverless
2. Full Documentation with OpenAPI

## API관련 문서
Swagger 참고
http://zupzup-serverless-finch.s3-website.ap-northeast-2.amazonaws.com/


## 사전준비

### Serverless 설치
```
npm install serverless --global # 또는 npm i serverless -g
```

### AWS Key 등록

1. Access Key와 Secret Key를 공용 구글 문서를 참고하여 취득
2. [Guide to Setup AWS Credentials](https://serverless.com/framework/docs/providers/aws/guide/credentials#using-aws-profiles) 페이지를 참고하여 설정


## Lambda 를 수정하고 반영하는 방법

### Installation

Download or clone this repo, then install Node.js using [nvm](https://github.com/creationix/nvm "creationix/nvm: Node Version Manager - Simple bash script to manage multiple active node.js versions").

```bash
$ cd to/this/dir
$ nvm install
$ nvm use
```

Install package.

```bash
$ npm install # or shortly npm i
```

### Run locally

```bash
$ npm start
```

Open the URL shown in your browser.

### Build

#### Development

```bash
$ npm run build
```

#### Production

```bash
$ npm run build:prod
```

### Deploy

#### Development

```bash
$ npm run deploy
```

#### Production

```bash
$ npm run deploy:prod
```

### Deploy Function

#### Development

```bash
$ npm run deploy:func -- --function functionName
```

#### Production

```bash
$ npm run deploy:func:prod -- --function functionName
```

### Lint

```bash
$ npm run lint
```

### Test

```bash
$ npm test
```

## OpenAPI 를 수정하고 반영하는 방법

1. vscode에서 install extension으로  openapi-viewer 설치

2. client/dist/openapi.yml 수정 (openapi-viewer로 고치면서 작성)

3. 배포
    ```
    serverless client deploy # 또는 npm run deploy:openapi
    ```

