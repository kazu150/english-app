# えーかいわログ
<img width="281" alt="スクリーンショット 2021-02-15 16 04 36" src="https://user-images.githubusercontent.com/33169480/107915477-e6f57680-6fa7-11eb-9c19-bf0214f41003.png"> 　　<img width="300" alt="スクリーンショット 2021-02-15 16 05 12" src="https://user-images.githubusercontent.com/33169480/107915476-e65ce000-6fa7-11eb-9b58-59371d9321eb.png">
  
### 目次
- アプリ概要
- アプリ機能一覧
- 使用イメージ
- ページ構成
- 環境構築・ローカル実行方法
- 利用ツール・フレームワーク・ライブラリ
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

### 現在実装済みの機能
| 機能名称             | 概説                       | 
| ----------------  | ---------------------------------- | 
| サインアップ             | メール認証でのサインアップ機能                       | 
| ログイン／ログアウト             | メール認証でのログイン機能                       | 
| プロフィール登録／編集    | ユーザーネーム、過去の英会話時間、メイン利用する英会話サービスを登録／編集できる                       | 
| 英語学習記録登録             | 英語学習記録の登録機能                       | 
| 英語学習記録閲覧             | カレンダー表示、国籍別表示に対応                       | 
| 英語学習編集／削除登録             | カレンダーから該当の学習記録を選択して、編集／削除ができる                       | 

### 今後実装予定の機能
- 月次ランキング機能追加
- 学習時間に応じてレベル表示機能を追加
- ロード時のスピナー追加
- メールアドレス認証への対応、パスワード再設定機能の追加
- ブログ（ヘッドレスCMS+SSGを利用予定）

## 使用イメージ
![englishapp](https://user-images.githubusercontent.com/33169480/107917246-f924e400-6faa-11eb-8822-dd742038416c.gif)  
デモアカウントからも確認できます  
`ID:　guest@guest.guest  
Pass: guest123`

または、`「ゲストアカウントで利用する」`ボタンをクリック


## ページ構成
| 名称             | PATH    | アクセス権限                       | 
| ---------------- | ------- | ---------------------------------- | 
| トップ画面| /　| 非ログインユーザー<br>ログインユーザー | 
| サインアップ画面 | /signup | 非ログインユーザー| 
|初期登録&設定画面|/settings|ログインユーザー| 
|マイページ|/[userId]|ログインユーザー| 
|英会話実施登録画面|/submit|ログインユーザー| 

## 環境構築・ローカル実行方法
1. gitをクローン
2. `node-js v14.4.0, npm v6.14.5`に合わせた上で、`npm i`
3. `yarn dev`でローカル環境を開く
4. `localhost:3000`でアプリをブラウザから表示

## 利用ツール・フレームワーク・ライブラリ
- Firebase
  - Firestore
  - Cloud Functions
  - Firebase Authentication
- Vercel （ホスティング先）
- React + React Hooks
- Next.js
- TypeScript
- Material-ui
- jest
- dayjs
- recharts
- node-js v14.4.0
- npm v6.14.5
  
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
