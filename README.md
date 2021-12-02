# 遊戲規則

Itemhub 採用去中心化決策流程, 每個人都能在 Issue 撰寫自己想為 Itemhub 開發的功能或是行銷任務,
目前加入這個組織的人, 必須先裝上 Homo.Bet 這個 Chrome Extension, Homo.Bet 會在每個月給予每個人 10 枚硬幣,
並把這些籌碼投注在 Issue 上面, 執行 Issue 的人可以賺取這些籌碼, 可為日後商店兌換加薪, 股權, 假期等

## Install Homo.Bet Chrome Extension

https://github.com/miterfrants/bet 先把這個專案 clone 下來, 將其中

- `chrome-ext/manifest.template.json` 改成 `chrome-ext/manifest.json`
- `chrome-ext/config.template.js` 改成 `chrome-ext/config.js` 並將其中的 `{DEV_API_ENDPOINT}` 和 `{PRODUCTION_API_ENDPOINT}` 改成相對應的網址
- 安裝會封裝的 chrome extension, 在 chrome 網址輸入 `chrome://extensions/` 接著選擇 `載入未封裝項目` 選擇存在 local 的 `chrome-ext` 資料夾, 載入後會出現 chrome extension id (如下圖) 把這個 Id 給 Homo.Bet 管理員他會給你一組 client id
- 修改 chrome extension manifest.json 中的 `{{clientId}}` 取代成 Homo.Bet 管理員給的 client id
- 以上步驟都完成以後在 `chrome://extensions/` 重新載入後開啟 Homo.Bet 當下就會註冊成一個會員並要求管理員把這個會員拉到 Itemhub 組織中

## Issue 開啟

## Issue 認領規則

## Issue 驗收
