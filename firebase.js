"use strict";
exports.__esModule = true;
exports.auth = exports.db = void 0;
var app_1 = require("firebase/app");
require("firebase/firestore");
require("firebase/auth");
var firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BACKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};
if (app_1["default"].apps.length === 0) {
    app_1["default"].initializeApp(firebaseConfig);
}
var db = app_1["default"].firestore();
exports.db = db;
var auth = app_1["default"].auth();
exports.auth = auth;
