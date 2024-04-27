export const createRoomID = () => {
    const letters = "1234567890abcdefABCDEF"
    const strArray = letters.split("")
    let string = ""
    for(let i=0; i<12; i++){
        if(i!=0 && i%4===0){
            string+="-"
        }
        string+=strArray[Math.floor(Math.random() * strArray.length)]
    }
    return string
}

export const passwordGenerator = () => {
    const letters = "1234567890abcdefABCDEF"
    const strArray = letters.split("")
    let string = ""
    for(let i=0; i<16; i++){
        string+=strArray[Math.floor(Math.random() * strArray.length)]
    }
    return string
}