export const isEmpty = function(value, isEval = false){
    if (isEval){
        try {
            return eval(value)
        } catch (err){
            return undefined
        }
    }

    return value === undefined || value === null || (typeof value === 'object' && Object.keys(value).length === 0) || (typeof value === 'string' && value.trim().length === 0)
}