



console.log(window.location.href);

document.getElementById('reset_btn').addEventListener('click',(e)=>{
    e.preventDefault();
    const newPswd = document.getElementById('new_pswd').value;
    const confirm_pswd = document.getElementById('confirm_pswd').value;

    const urlStr= window.location.href;
    if(newPswd===confirm_pswd){
        axios.post(urlStr,{new_password:newPswd})
        .then(result =>{
            window.alert(result.data.msg);
            window.location.href=result.data.url;
        })
        .catch(err=>console.log(err));
    }else{
        window.alert('both passwords are not matched. pls check again')
    }
    
})