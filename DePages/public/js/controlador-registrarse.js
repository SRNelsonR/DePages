$(document).ready(function(){
    //Cargar género
    $.ajax({
        url:"/cargar-genero",
        method:"GET",
        dataType:"json",
        success:function(res){
            res.forEach(function(element) {
                $("#slc-genero").append(
                    `<option value="${element.codigo_genero}">${element.nombre_genero}</option>`
                );
            });
        },
        error:function(error){
            console.error(error);
        }
    });

    //Cargar Tipo Plan
    $.ajax({
        url:"/cargar-plan",
        method:"GET",
        dataType:"json",
        success:function(res){
            res.forEach(function(element) {
                $("#slc-plan").append(
                    `<option value="${element.codigo_plan}">${element.nombre_plan}</option>`
                );
            });
        },
        error:function(error){
            console.error(error);
        }
    });
});


//Función para crear nuevo usuario verificando que los campos esten llenos
$("#btn-crear").click(function(){
    var date = new Date();
    var fecha = date.getFullYear() + "-"   + (date.getMonth()+1) + "-" + date.getDate() ;
    var datos = "nombre=" + $("#txt-nombre").val() + "&apellido=" + $("#txt-apellido").val() + "&correo=" +$("#txt-correo").val() + "&contrasena=" + $("#txt-password").val() + "&nickname=" + $("#txt-usuario").val() + "&genero=" + $("#slc-genero").val() + "&plan=" + $("#slc-plan").val() + "&fecha=" + fecha;
    if( 
        $("#txt-nombre").val() == "" ||
        $("#txt-apellido").val() == "" ||
        $("#txt-correo").val() == "" ||
        $("#txt-password").val() == "" ||
        $("#txt-usuario").val() == "" ||
        $("#txt-genero").val() == "" ||
        $("#txt-plan").val() == ""
    ){
        //alert("valores vacios");
        $("#error").fadeIn().delay(3000).fadeOut();
    }else{
        //alert("Llenos");        
        $.ajax({
            url:"/crear-usuario",
            method:"POST",
            data:datos,
            dataType:"json",
            success:function(res){
                console.log(res);
                $("#creado").fadeIn().delay(3000).fadeOut();
                window.setTimeout(function(){
                    window.location.href = "/login.html";
                }, 5000);
                $("#btn-crear").prop('disabled', true)
            },
            error:function(error){
                console.error(error);
            }
        });
    }
});