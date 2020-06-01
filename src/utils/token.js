const KEY = 'heimamm_token'

const setToken = token =>{
    localStorage.setItem(KEY,token)
}

const getToken =()=>{
    return localStorage.getItem(KEY)
}

const removeToken = ()=>{
    localStorage.removeItem(KEY)
}

// export default setToken
// 这样只能导出一个,在想导出的话后面的会覆盖前面的

//按需导出,可以导出多个
export {setToken,getToken,removeToken}