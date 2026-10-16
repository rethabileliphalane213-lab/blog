function otpPin(){
    let otp=""
    for(let i=0;i<7;i++){
        const randomNum=Math.floor(Math.random()*10)
           otp= otp +randomNum
        
    }
    return otp
    console.log("otp pin is",otp)
}

export default otpPin