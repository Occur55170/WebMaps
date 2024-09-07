module.exports = {
    env: {
        browser: true, // 指定程式碼執行環境為瀏覽器
        es2021: true,  // 使用 2021 年的 ECMAScript 功能
        jquery: true   // 全局認定 jQuery 變數存在
    },
    extends: [
        "plugin:vue/vue3-essential", // 对于 Vue 3.x 使用 vue3-essential, 对于 Vue 2.x 使用 vue/essential
        "@vue/standard"              // 使用 Vue 官方的标准配置
    ],
    parserOptions: {
        parser: '@babel/eslint-parser',  // 指定 JavaScript 的解析器

        requireConfigFile: false, // 不需要 Babel 配置文件
        ecmaVersion: 2021, // 更新為更具體的年份版本，對應 ES2021 標準
        sourceType: 'module', // 程式碼使用 ES 模組
    },
    globals: {
        $: 'readonly',      // jQuery 的 $ 符號設為只讀
        jQuery: 'readonly', // jQuery 變數設為只讀
    },
    rules: {
        'comma-dangle': ['error', 'only-multiline'], // 多行時允許尾隨逗號
        quotes: ['error', 'single'], // 強制使用單引號
        'space-before-blocks': ['error', 'never'], // 區塊語句前不使用空格
        'no-unused-vars': ['warn'], // 未使用變數發出警告
        'no-new': ['warn'], // 使用 new 造成的副作用發出警告
        'no-case-declarations': 'off', // 允許在 case 子句中宣告變數
        'space-before-function-paren': ['error', { // 函式括號前的空格處理
            anonymous: 'never',  // 匿名函式：無空格
            named: 'never',      // 命名函式：無空格
            asyncArrow: 'always' // 異步箭頭函式：總是有空格
        }],
        indent: [
            'warn',  // 縮進問題發出警告
            4,       // 指定縮進為 4 個空格
            {
                SwitchCase: 1,         // switch 語句中 case 縮進 1 層
                VariableDeclarator: 1, // 變數宣告縮進 1 層
                MemberExpression: 0,   // 成員表達式不額外縮進
                ObjectExpression: 1,   // 物件表達式內的屬性縮進 1 層
                ArrayExpression: 1,    // 陣列表達式內的元素縮進 1 層
                ImportDeclaration: 1   // import 宣告縮進 1 層
            }
        ]
    },
}
