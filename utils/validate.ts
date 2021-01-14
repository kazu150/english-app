// emailの正規表現
export const regEmail = /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/;
// 半角英字と数字の組み合わせ8-15文字の正規表現
export const regPass = /^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,15}$/i;
