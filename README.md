# 英会話アプリ

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
- Next.js
- Vercel
- TypeScript

## DBのデータ構成
- usersコレクション (各ユーザーの情報のうち、各ユーザー自身しか閲覧できないもの)
  - createdAt: Timestamp (ドキュメント作成日)
  - updatedAt: Timestamp (ドキュメント最終更新日)
  - initialTime: number (アプリ使用前にすでに何分間英語を学習していたか)
  - englishService: reference (メインで使う英会話サービス名)
  
  - studyLogコレクション
    - count: number (今回何セット英会話学習をしたか)
    - date: Timestamp (ドキュメント作成日)
    - nationality (今回の英会話講師の国籍)
    - englishService: string (今回利用した英会話サービス名)
    - time: number (今回の英語学習時間(分))

- publicProfilesコレクション (各ユーザーの情報のうち、全ユーザーに公開可能なもの)
  - createdAt: Timestamp (ドキュメント作成日)
  - updatedAt: Timestamp (ドキュメント最終更新日)
  - name: string (ユーザー名)
  - photoUrl: string (ユーザーのアイコン画像ファイルUrl)
  - studyTime: number (これまでの総英語学習時間(分))

- englishServiceコレクション (各英会話サービスの詳細情報)
  - englishServiceName: string (各英会話サービスの名称)
  - defaultTime: number (各英会話サービスの1回の授業時間(分))

## フロントエンド（reducer）にて管理するデータ構造
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

## Cloud Functionsで管理している関数
▼sumUpStudyTimeOnChangeInitialTime  
users>initialTimeを上書きした際、トータルの勉強時間を再計算し、publicProfiles>studyTimeを更新

sumUpStudyTimeOnWriteStudyLog  
users>userLogの勉強記録を追加、上書き、削除した際、トータルの勉強時間を再計算し、publicProfiles>studyTimeを更新