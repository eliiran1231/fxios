const axios = require('axios').default;
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');
const md5 = require('md5');
const querystring = require('querystring');
const cheerio = require('cheerio');
const fs = require('fs');
const instance = axios.create({
  withCredentials: true
})
axiosCookieJarSupport(instance);
instance.defaults.jar = new tough.CookieJar();



const bot = {
  login:function(username, password){ 
    return new Promise((resolve, reject) => {
      const data = querystring.stringify({
        do: "login",
        vb_login_md5password: md5(password),
        vb_login_md5password_utf: md5(password),
        s: "",
        securitytoken: "guest",
        cookieuser: "1",
        url: "https://www.fxp.co.il/",
        vb_login_username: username,
        vb_login_password: "",
      })

      const options = querystring.stringify({
        headers:{
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36"  
        } ,
        
      })
      
      instance.post("https://www.fxp.co.il/login.php?do=login", data, options)
      .then((res) => {
        console.log('logged in');
        resolve(res);
      }) 
        .catch((error) =>{
        reject(error);      
        })
  
  
  }) 
},
  addmember:function(username, password){
    const data = querystring.stringify({
      username: username ,
      password: "" ,
      passwordconfirm: "" ,
      email: username + "e@gmail.com",
      emailconfirm: "",
      agree: "1" ,
      s: "",
      securitytoken: "guest" ,
      do: 'addmember' ,
      url: "https://www.fxp.co.il/",
      password_md5: md5(password) ,
      passwordconfirm_md5: md5(password) ,
      day: "",
      month: "",
      year:""
    })
    const options = querystring.stringify({
      headers:{
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36"  
      } ,
    })
    axios.post("https://www.fxp.co.il/register.php?do=addmember", data, options)
    .then((res) => {
      console.log(`statusCode: ${res.statusCode}`);
      console.log("the user "+ username +" has created sueccesfully");
    }) 
    .catch((error) =>{
      console.error(error);
    })
  }, 
  logout:function(){
  instance.get("https://www.fxp.co.il/")
    .then(function(res){
    var securitytoken = res.data.split('var SECURITYTOKEN = "')[1].split('"')[0]
    instance.get("https://www.fxp.co.il/login.php?do=logout&logouthash=" + securitytoken)
    .then((res) => {
    console.log("logged out")
    })
    .catch((err)=> {console.log(err);
     }) 
    })
    
  },
  makelike:function(id, res){
    const data = querystring.stringify({
      do: 'add_like',
      postid: id,
      securitytoken: res.data.split('var SECURITYTOKEN = "')[1].split('"')[0],
      fxppro: ""
    })
    const options = querystring.stringify({
      headers:{
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36"  
      } ,
    })
    axios.post("https://www.fxp.co.il/ajax.php", data, options)
    .then((res) => {
      console.log(`statusCode: ${res.statusCode}`);
      console.log(res);
    }) 
    .catch((error) =>{
      console.error(error);
    })

  
},

}

bot.login("username", "password")
.then((res)=>{
  //any action
})


