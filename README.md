# 英会話アプリ
  
### 目次
- アプリ概要
- アプリ仕様
- ページ構成
- 利用ツール
- データ設計
- Firestoreセキュリティルールの設定
- Firebase Authenticationの設定
- Cloud Functions上の関数の設定

## アプリ概要
オンライン英会話サービス（DMM英会話など）での学習記録をつけられるアプリです。  
現在は学習時間や学習履歴、会話相手の国籍の簡単な表示しかできませんが、  
徐々に機能を付加していく予定です  
アプリURL: https://english-app.kazu150.vercel.app/
  
### 特に注力した所
- Firestoreのセキュリティルール
- セキュリティルールのテスト  
→Firestoreのセキュリティルールは可能な限り厳しく書くよう心がけました。  
また、セキュリティルールの検証スピードを上げるため、  
FirebaseのエミュレータとJestを使ったテストを導入しています。


## アプリ仕様
- メール認証でのログイン機能
- メイン利用する英会話サービスの登録機能
- 英語学習記録の登録機能
- 英語学習記録の閲覧機能（カレンダー表示、国籍別表示）

## ページ構成
| 名称             | PATH    | アクセス権限                       | 
| ---------------- | ------- | ---------------------------------- | 
| トップ画面| /　| 非ログインユーザー<br>ログインユーザー | 
| サインアップ画面 | /signup | 非ログインユーザー| 
|初期登録&設定画面|/settings|ログインユーザー| 
|マイページ|/[userId]|ログインユーザー| 
|英会話実施登録画面|/submit|ログインユーザー| 

## 利用ツール
- Firebase
  - Firestore
  - Cloud Functions
  - Firebase Authentication
- Vercel
- React + React Hooks
- Next.js
- TypeScript
- Material-ui
  
## データ設計
### フロントエンド（reducer）にて管理するデータ
- currentUser
  - userId
  - name
  - initialTime
  - englishService
  - studyTime
  - photoUrl
- error
  - isOpened
  - message
  - errorPart

### Firestoreのデータ設計
▼usersコレクション (各ユーザーの情報のうち、各ユーザー自身しか閲覧できないもの)
|Column	|Type	|Options|Details|
| ---------------- | ------- | ------ | ---------------------------------- |   
|createdAt	|Timestamp	|null: false|  ドキュメント作成日|  
|updatedAt	|Timestamp	|null: false|  ドキュメント最終更新日|  
|initialTime	|number	|null: false|  アプリ使用前にすでに何分間英語を学習していたか|  
|englishService	|reference	|null: false|  メインで使う英会話サービス名|  

  
▼usersコレクション > studyLogサブコレクション (各ユーザーの各回ごとの詳細な勉強ログ)
|Column	|Type	|Options|Details|
| ---------------- | ------- | ------ | ---------------------------------- |   
|count	|number	|null: false|  今回何セット英会話学習をしたか|  
|date	|Timestamp	|null: false|  ドキュメント作成日|  
|nationality	|reference	|null: false|  今回の英会話講師の国籍|  
|englishService	|reference	|null: false|  今回利用した英会話サービス名| 
|time	|number	|null: false|  今回の英語学習時間(分)|  

  
▼publicProfilesコレクション (各ユーザーの情報のうち、全ユーザーに公開可能なもの)
|Column	|Type	|Options|Details|
| ---------------- | ------- | ------ | ---------------------------------- |   
|createdAt	|Timestamp	|null: false|  ドキュメント作成日|  
|updatedAt	|Timestamp	|null: false|  ドキュメント最終更新日|  
|name	|string	|null: false|  ユーザー名|  
|photoUrl	|string	|null: false|  ユーザーのアイコン画像ファイルUrl| 
|studyTime	|number	|null: false|  これまでの総英語学習時間(分)|  
  
  
▼englishServiceコレクション (各英会話サービスの詳細情報)
|Column	|Type	|Options|Details|
| ---------------- | ------- | ------ | ---------------------------------- |   
|englishServiceName	|string	|null: false|  各英会話サービスの名称|  
|defaultTime	|number	|null: false|  各英会話サービスの1回の授業時間(分)|  
  
  
▼nationalitiesコレクション (講師の国籍)
|Column	|Type	|Options|Details|
| ---------------- | ------- | ------ | ---------------------------------- |   
|countryName	|string	|null: false|  各講師の出身国名| 

## Firestoreセキュリティルールの設定
- collectionごとに設定。
- 認可部分とバリデーション部分（`null`許容するか、型は正しいか、値は許容範囲か）から構成
- セキュリティルールはエミュレータを用いたテストにて検証(`/__test__/firestore.test.js`)

### テストの立ち上げ方
1. `firebase emulators:start --only firestore`でエミュレータ起動
2. `yarn jest`でテスト  
エラーの際はローカルサーバーが別の処理に使われている可能性あり  
https://qiita.com/kskumgk63/items/949a2a95c08c6c12aa47

## Firebase Authenticationの設定
- `displayName`を追加設定済
- （今後）Eメール認証機能をつけたい

## Cloud Functions上の関数の設定
※本来フロントで完結できる部分なので、後日フロント側に移設の予定  
▼sumUpStudyTimeOnChangeInitialTime  
`users>initialTime`を上書きした際、トータルの勉強時間を再計算し、`publicProfiles>studyTime`を更新

▼sumUpStudyTimeOnWriteStudyLog  
`users>userLog`の勉強記録を追加、上書き、削除した際、トータルの勉強時間を再計算し、`publicProfiles>studyTime`を更新
