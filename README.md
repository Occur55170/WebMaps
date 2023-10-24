# 新竹縣部落安全防減災 | [Demo](https://occur55170.github.io/Map_Demo/)  

### 畫面展示

#### 登入頁
![登入頁](https://upload.cc/i1/2023/10/21/qjzEne.jpg)
#### 地圖
![地圖](https://upload.cc/i1/2023/10/21/fnxh0H.jpg)
#### 細節頁
![細節頁](https://upload.cc/i1/2023/10/21/PLi1hl.jpg)

=======

## 作品簡介
此專案使用了Vue3 + Vite框架，採用Composition API 進行開發並使用OpenLayers作為地圖庫。該網站採用SASS和Bootstrap 5來實現美觀的風格和易於維護的CSS。並且通過響應式設計，使網站能在不同設備上自動適應，提供良好的使用者體驗，主要頁面有：

  - 網站登入頁：網站登入頁
  - 首頁：主要頁面，有基本常見的地圖縮放、定位、指北功能，還可以切換底圖及新增圖層進去，也可以針對已選擇的圖層做排序或透明化的處理。另外，此頁還有雙地圖功能，可以讓使用者同時打開地圖並讓左右地圖上的圖層互相比對  
  - 部落細節頁：針對個別部落更詳細的介紹，包含當地特色、歷史災害紀錄...等。
  - 工程計畫頁面：針對部落細節的部落之後預計會有的工程計畫頁書的頁面。
  
  
## Skills | 使用技術

使用Vue前端框架，讓協作開發與日後擴充修改更容易，並提供更平順的瀏覽體驗

* 程式相關
  * Vue3: 建構 SPA，前後端分離開發
  * Vite : 整合 Vue 生態系的開發環境
  * Vue Component: 將 Web 應用元件化，方便管理、協作
  * Vue Router: 管理前端路由
  * ES6: 使用現代主流瀏覽器支援的 JavaScript 語法
  * Openlayer: 用來在Web瀏覽器上顯示的主要地圖庫。
  
* 切版相關
  * CSS3: 使用現代主流瀏覽器支援的 CSS 
  * SCSS: 巢嵌 CSS，開發樣式更方便
  * Bootstrap5: 格線系統、顏色管理、元件、utility
  * RWD: 不同斷點的變化，使用者體驗更好
  
* 工具相關
  * Github: 控管程式碼版本
  * VSCode: 編譯工具
  
* 其他
  * vue-router: 處理商品分類的網址


## Plugins | 使用插件
* [Vue](https://www.npmjs.com/package/vue) | 前端框架
* [Vite](https://github.com/vitejs/vite) | 前端建置工具
* [Openlayer](https://github.com/openlayers/openlayers) | 地圖庫
* [ol-cesium](https://github.com/openlayers/ol-cesium) | Openlayer的副套件
* [bootstrap](https://www.npmjs.com/package/bootstrap) | CSS library
* [jquery](https://www.npmjs.com/package/jquery) | Jquery
* [Vue-router](https://www.npmjs.com/package/vue-router) | 管理 vue 前端路由
* [Vue-Carousel](https://www.npmjs.com/package/vue-carousel) | 輪播圖套件
* [html-to-image](https://github.com/bubkoo/html-to-image) | Html轉圖片工具
* [Vue-meta](https://www.npmjs.com/package/vue-meta) | 動態切換meta
* [eslint](https://github.com/eslint/eslint) | eslint，自動排版
* [gh-pages](https://www.npmjs.com/package/gh-pages) | 將編譯後的程式碼佈署到 gh-pages
* [@fontawesome](https://fontawesome.com/how-to-use/on-the-web/setup/using-package-managers) | icon 圖示

## 環境建構
```
npm install   # 安裝相依套件
npm run dev # 建立開發環境
npm run build # 編譯出能放到生產環境的程式碼
```
