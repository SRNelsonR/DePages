$(document).ready(function(){
    obtenerSession();
    cargarSelectPlan();
});

function cargarInformacion(codigo_usuario){
    var datos = `usaurio=${codigo_usuario}`;
    $.ajax({
        url:"/informacion-usuario",
        method:"GET",
        data:datos,
        dataType:"json",
        success:function(res){
            $("#nombre-usuario").html(res[0].nombre);
            $("#apellido-usuario").html(res[0].apellido);
            $("#correo").html(res[0].correo);
            $("#nickname").html(res[0].nickname);
            $("#fecha-creacion").html(res[0].fecha_creacion);
            $("#genero").html(res[0].nombre_genero);
            $("#plan").html(res[0].nombre_plan);

            $("#nombre-modal").val(res[0].nombre);
            $("#apellido-modal").val(res[0].apellido);
            $("#correo-modal").val(res[0].correo);
            $("#nickname-modal").val(res[0].nickname);
            $("#genero-modal").val(res[0].nombre_genero);
            $("#plan-modal").val(res[0].nombre_plan);
        },
        error:function(error){
            console.error(error);
        }
    });
}

function obtenerSession(){
    $.ajax({
        url:"/obtener-session",
        method:"GET",
        dataType:"json",
        success:function(res){
            $("#usuario-nickname").val(res.nickname);
            $("#codigo-usuario").val(res.codigoUsuario);
            cargarInformacion(res.codigoUsuario);
        },
        error:function(error){
            console.error(error);
        }
    });
}

function cargarSelectPlan(){
    $.ajax({
        url:"/cargar-plan",
        method:"GET",
        dataType:"json",
        success:function(res){
            res.forEach(function(element){
                $("#slc-plan").append(
                    `<option value="${element.codigo_plan}">${element.nombre_plan}</option>`
                );
            });
        },
        error:function(error){
            console.error(error);
        }
    });
}

$("#btn-modificar-datos").click(function(){
    var datos = `nombre=${$("#nombre-modal").val()}&apellido=${$("#apellido-modal").val()}&correo=${$("#correo-modal").val()}&nickname=${$("#nickname-modal").val()}&codigo_plan=${$("#slc-plan").val()}&contrasena=${$("#contrasena-modal").val()}&codigo_usuario=${$("#codigo-usuario").val()}`;
    $.ajax({
        url:"/actualizar-usuario",
        method:"POST",
        data:datos,
        dataType:"json",
        success:function(res){
            actualizarSesion($("#correo-modal").val(), $("#contrasena-modal").val());
            window.setTimeout(function(){
                window.location.href = "/perfil.html";
            }, 1000);
        },
        error:function(error){
            console.error(error);
        }
    });
});

function actualizarSesion(correo, contrasena){
    var datos = `correo=${correo}&contrasena=${contrasena}`;
    $.ajax({
        url:"/actualizar-variables-session",
        method:"POST",
        data:datos,
        dataType:"json",
        success:function(res){
            
        },
        error:function(error){
            console.error(error);
        }
    });
}

/* Cerrar Sesión */
$("#cerrar-sesion").click(function(){
    $.ajax({
        url:"/cerrar-session",
        method:"GET",
        success:function(res){
            console.log(res);
            window.location.href = "/index.html";
        },
        error:function(error){
            console.error(error);
        }
    });
});