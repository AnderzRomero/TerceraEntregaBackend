const token = localStorage.getItem('accessToken');
if(!token) window.location.replace('/login');

//TODO LO PIDO DESDE EL CLIENTE, ES MI RESPONSABILIDAD ENVIAR ESE TOKEN
fetch('/api/sessions/profileInfo',{
    method:'GET',
    headers:{
        authorization: `Bearer ${token}`
    }
}).then(response=>response.json())
.then(result=>{
    //Aquí relleno mis datos
    console.log(result);
    const user = result.payload;
    const welcome = document.getElementById('welcome');
    const email = document.getElementById('email');
    welcome.innerHTML = `Hola, ${user.name}, tu rol es: ${user.role}`;
    email.innerHTML = `Correo: ${user.email}`
})