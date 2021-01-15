const convertKToC = (temp) => {
        return Math.round(temp - 273.15);
    }
    
const convertKToF = (temp) => {
    return  Math.round((temp - 273.15) * 9/5 + 32); 
}

const convertCToF = (cel) => {
    return  Math.round((cel*9/5) + 32); 
}

const convertFToC = (fah) => {
    return  Math.round((fah - 32) * 5/9); 
}

export {convertKToC, convertKToF, convertCToF, convertFToC}