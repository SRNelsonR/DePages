$(document).ready(function(){
    
});

$("#btn-ingresar").click(function(){
    var datos = "correo=" + $("#inputEmail").val() + "&contrasena=" + $("#inputPassword").val();
    if(
        $("#inputEmail").val() == "" ||
        $("#inputPassword").val() == ""
    ){
        $("#error-login").fadeIn().delay(3000).fadeOut();
    }else{
        $.ajax({
            url:"/login",
            method:"POST",
            data:datos,
            dataType:"json",
            success:function(res){
                console.log(res);
                if (res.length == 1)
                    window.location.href = "/perfil.html";
                else 
                    alert("Credenciales invalidas");
            },
            error:function(error){
                console.error(error);
            }
        });
    }
});