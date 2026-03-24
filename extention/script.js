let tasks = ["limpar o chão","Fazer o dever de casa","Trabalhar muito"]

function todas(){
for (let trab in tasks) {
    
    document.getElementById("parte").innerHTML+=`
    <div class="tasks" name="${tasks[trab]}">
    <input type="checkbox" >
    <p>${tasks[trab]}</p>
    <img class='pin' name="${tasks[trab]}"  src="Group-9.png" width="30px" height="30px">
    </div>`   
}
}

todas()


let statu=false
 let num =0
document.getElementById('parte').addEventListener('click',function(){
    let pin=(event.target.getAttribute('name'));
   
    for (let trab in tasks){    
        if (tasks[trab]==pin){
            num = trab
            console.log(trab);
            
        }}

        if (statu == false){
            document.getElementById("parte").innerHTML=`
            <div class="tasks" name="${tasks[num]}">
            <input type="checkbox" >
            <p>${tasks[num]}</p>
            <img class='pin' name="${tasks[num]}"  src="Group-9.png" width="30px" height="30px">
            </div>`   
            statu=true
        }

        else{
            statu=false
            document.getElementById("parte").innerHTML=''
            todas()
        }
    
    

})