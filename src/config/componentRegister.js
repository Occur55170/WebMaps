import { defineAsyncComponent } from 'vue'

const components = import.meta.glob('./components/global/*.vue')

/**
 * 安裝並註冊所有全局組件
 * @param {Object} app - Vue 應用實例
 */
export default function install(app){
    for (const [key, value] of Object.entries(components)){
        try {
            const componentName = getComponentName(key)
            app.component(componentName, defineAsyncComponent(value))
        } catch (error){
            console.error(`Failed to register component: ${key}`, error)
        }
    }
}

/**
 * 根據文件路徑獲取組件名
 * @param {string} filePath - 文件路徑
 * @returns {string} 組件名
 */
function getComponentName(filePath){
    const fileName = filePath.slice(
        filePath.lastIndexOf('/') + 1,
        filePath.lastIndexOf('.'),
    )
    return convertToPascalCase(fileName)
}

/**
 * 將文件名轉換為 PascalCase 格式
 * @param {string} str - 文件名
 * @returns {string} PascalCase 格式的組件名
 */
function convertToPascalCase(str){
    return str.replace(/(^\w|-\w)/g, clearAndUpper).replace(/-/g, '')
}

/**
 * 清除連字符並將字母轉為大寫
 * @param {string} text - 字符
 * @returns {string} 大寫字符
 */
function clearAndUpper(text){
    return text.replace(/-/, '').toUpperCase()
}
