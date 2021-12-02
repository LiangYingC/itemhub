# 遊戲規則

Itemhub 採用去中心化決策流程, 每個人都能在 Issue 撰寫自己想為 Itemhub 開發的功能或是行銷任務,
目前加入這個組織的人, 必須先裝上 Homo.Bet 這個 Chrome Extension, Homo.Bet 於每個星期日發放 10 枚硬幣,
你可以把這些籌碼投注在你所關心的 Issue 上面, 如果在下一個星期日來臨時還沒把籌碼投注完則會被清空, 執行 Issue 的人並完成驗收
可以賺取這些被投注在 Issue 上的籌碼, 可為日後商店兌換加薪, 股權, 假期等

## Install Homo.Bet Chrome Extension

https://github.com/miterfrants/bet 先把這個專案 clone 下來, 按以下幾個步驟來完成安裝

- 在載下來的路徑中找到 chrome-ext 資料夾, 修改設定資料
  - `chrome-ext/manifest.template.json` 改成 `chrome-ext/manifest.json`
  - `chrome-ext/config.template.js` 改成 `chrome-ext/config.js` 並將其中的 `{DEV_API_ENDPOINT}` 和 `{PRODUCTION_API_ENDPOINT}` 改成相對應的網址
- 安裝 Chrome Extension

  - 在 chrome 網址欄輸入 `chrome://extensions/`
  - `載入未封裝項目` 選擇剛剛修改的 chrome-ext 資料夾
  - 載入後會出現 chrome extension id (如下圖) 把這個 Id 給 Homo.Bet 管理員他會給你一組 client id
    <img width="417" alt="截圖 2021-12-02 下午4 03 27" src="https://user-images.githubusercontent.com/2028693/144387289-34e9b059-22b2-4834-9cc4-01c486ad0c2a.png">

  - 修改 chrome extension `chrome-ext/manifest.json` 中的 `{clientId}` 取代成 Homo.Bet 管理員給的 client id
  - 以上步驟都完成以後在 `chrome://extensions/` 重新載入後開啟 Homo.Bet 如下圖紅色圈起的地方
    <img width="417" alt="截圖 2021-12-02 下午4 03 27 (1)" src="https://user-images.githubusercontent.com/2028693/144387503-06bad2ec-f590-4f7c-a7cd-31e5a332c7cb.png">

- 要求管理員把這個會員拉到 Itemhub 組織中

## Issue 開啟

- 目前沒有任何開啟 Issue 的規範
- 開啟 Issue 的使用者在有其他人投注籌碼的當下會獲得 1 枚硬幣做為獎勵

## 投注

- 連到 Itemhub issues 畫面 https://www.github.com/miterfrants/itemhub/issues
- 開啟 Homo Bet 的 Chrome Extension 你將會看到以下畫面, 點擊 `Sync Github Issue`
  <img width="348" alt="截圖 2021-12-02 下午4 44 36" src="https://user-images.githubusercontent.com/2028693/144387873-cb68ef3e-dfd7-4c58-98fe-a3254c90a2ac.png">

- 接著你會在 Github Header 上看到你剩下的籌碼, 並看到每一個 Issue 現在認領的人, 預計完成的時間和一個加減籌碼的按鈕
- 按下加減按鈕來投注你關心的 Issue, 如果已經有人認領的 Issue 你就無法減少你當初投注的籌碼, 只能加碼

## Issue 認領規則

- 連到 Itemhub issues 畫面 https://www.github.com/miterfrants/itemhub/issues
- 開啟 Homo Bet 的 Chrome Extension 你將會看到以下畫面, 點擊 `Sync Github Issue`
- 評估 Issue 上的籌碼是否符合期待, 按下 `Claim` 並輸入預期的完成時間 (時間目前沒有懲罰條款, 未來可能有延遲懲罰)
- 把 Issue Assign 自己
- 實作完成時把 Issue lable 上 `Done`, 並在 Issue 列表開啟 `Sync Github Issue` 把完成的 Issue 按下 `Mark Finish`

## Issue 驗收

- 驗收已標記上 `Done` 的 Issue
- 依照 Issue 上面的驗收列表檢驗是否真實完成
- 如果已完成在 Issue 列表開啟 `Sync Github Issue` 把完成的 Issue 按下 `Done`
- 接著把這個 Issue Close 掉
