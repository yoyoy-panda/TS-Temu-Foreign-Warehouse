# TS_TEMU_UI 專案

這個專案是一個基於 React、TypeScript 和 Vite 的前端應用程式，旨在提供一個使用者認證介面。它整合了多種現代前端技術和工具，以確保開發效率和應用程式的穩定性。

## 技術棧

- **前端框架**: React 19
- **語言**: TypeScript
- **建構工具**: Vite 7
- **樣式**: Material-UI (MUI), Tailwind CSS (透過 `@tailwindcss/vite` 和 `postcss`)
- **路由**: React Router DOM 7
- **API 請求**: Axios
- **國際化**: i18next, react-i18next
- **程式碼風格/品質**: ESLint, TypeScript ESLint

## 功能與運作流程

這個專案主要提供一個使用者認證介面，其核心功能和運作流程如下：

1.  **使用者認證**:

    - 透過 `AuthPage.tsx` 頁面呈現認證表單 (`AuthForm.tsx`)。
    - 使用者輸入相關資訊（例如國家代碼、電話號碼等）。
    - `useAuthLogic.ts` Hook 處理認證邏輯，包括表單驗證 (`validation.ts`) 和 API 請求。

2.  **API 互動**:

    - 專案包含 `api/` 目錄，其中定義了 `MockApi.tsx` 和 `RealApi.tsx`，允許在開發和生產環境中切換不同的 API 實作。
    - `axios` 用於發送 HTTP 請求到後端服務。

3.  **國際化 (i18n)**:

    - 透過 `i18n/` 目錄中的配置 (`i18n.ts`) 和翻譯檔案 (`en-US.json`, `zh-CN.json`, `zh-TW.json`) 支援多語言介面。
    - `react-i18next` 整合 React 組件與國際化功能。

4.  **UI 元件**:

    - `components/` 目錄包含多個可重用 UI 元件，例如 `BasicButton.tsx`、`CountryCodeSelect.tsx`、`VerifyButton.tsx` 和 `GenerateButton.tsx`，這些元件共同構建了使用者介面。
    - `AuthMessage.tsx` 用於顯示認證相關的訊息。

5.  **樣式與主題**:

    - 使用 Material-UI (MUI) 提供豐富的 UI 組件和設計系統。
    - `src/styles/theme.ts` 定義了應用程式的主題，確保視覺一致性。
    - `src/styles/commonStyles.ts` 包含通用的樣式定義。
    - 整合 Tailwind CSS 進行快速樣式開發。

6.  **錯誤處理與重試**:
    - `EditDataRestartButton.tsx` 用於在資料輸入錯誤或需要重新開始時提供重置功能。

整體而言，專案透過模組化的方式組織程式碼，將 UI、邏輯、API 服務和國際化分離，提高了可維護性和可擴展性。

## 專案結構

```
.
├── public/                 # 靜態資源
├── src/
│   ├── api/                # API 服務定義 (MockApi, RealApi, commonApi)
│   ├── assets/             # 靜態資源 (圖片, JSON 資料如 contrycode.json)
│   ├── components/         # 可重用 UI 元件 (AuthForm, VerifyButton, GenerateButton 等)
│   ├── hooks/              # 自定義 React Hooks (useAuthLogic)
│   ├── i18n/               # 國際化配置和翻譯檔案 (en-US, zh-CN, zh-TW)
│   ├── pages/              # 應用程式頁面 (AuthPage)
│   ├── styles/             # 全域樣式和主題配置 (commonStyles, theme)
│   ├── types/              # TypeScript 類型定義 (api.d.ts)
│   ├── utils/              # 工具函數 (validation)
│   ├── App.tsx             # 主要應用程式組件
│   └── main.tsx            # 應用程式入口點
├── .gitignore              # Git 忽略檔案配置
├── eslint.config.js        # ESLint 配置
├── index.html              # HTML 模板
├── package.json            # 專案依賴和腳本
├── package-lock.json       # 依賴鎖定檔案
├── tsconfig.json           # TypeScript 配置
├── tsconfig.app.json       # 應用程式 TypeScript 配置
├── tsconfig.node.json      # Node 環境 TypeScript 配置
└── vite.config.ts          # Vite 配置
```

## 安裝

1.  **複製專案**:

    ```bash
    git clone <專案的 Git URL>
    cd TS_TEMU_UI
    ```

2.  **安裝依賴**:
    ```bash
    npm install
    ```

## 開發

啟動開發伺服器：

```bash
npm run dev
```

這將在 `http://localhost:2019` (或類似埠號) 啟動一個開發伺服器，並支援熱模組替換 (HMR)。

## 建構

建構生產環境的應用程式：

```bash
npm run build
```

這將在 `dist/` 目錄中生成優化後的靜態檔案。

## 程式碼風格檢查

執行 ESLint 檢查程式碼風格和潛在問題：

```bash
npm run lint
```

## 擴展 ESLint 配置

如果需要更嚴格的型別感知 Lint 規則，可以參考 `eslint.config.js` 中的註釋，啟用 `tseslint.configs.recommendedTypeChecked` 或 `tseslint.configs.strictTypeChecked`。

## 貢獻

歡迎貢獻！請遵循以下步驟：

1.  Fork 專案。
2.  創建您的功能分支 (`git checkout -b feature/AmazingFeature`)。
3.  提交您的更改 (`git commit -m 'Add some AmazingFeature'`)。
4.  推送到分支 (`git push origin feature/AmazingFeature`)。
5.  開啟一個 Pull Request。

## 許可證

(請在此處填寫您的許可證資訊，例如 MIT 許可證)

## 聯絡方式

(請在此處填寫聯絡資訊，例如電子郵件或專案維護者)
