$(document).ready(function(){
    $.ajax({
        url:"/obtener-session",
        method:"GET",
        dataType:"json",
        success:function(res){
            $("#usuario-nickname").val(res.nickname);
            $("#codigo-usuario").val(res.codigoUsuario);
            cargarProyectos(res.codigoUsuario);
        }
    });
    
});

function cargarProyectos(codigo){
    var cpDatos = "codigo_usuario=" + codigo;
    $.ajax({
        url:"/cargar-proyectos",
        method:"GET",
        data:cpDatos,
        dataType:"json",
        success:function(res){
            console.log(res);
            res.forEach(function(element){
                $("#contenedor-proyectos").append(
                    `<div id="proyecto-info" class="col-lg-12">
                        <button class="btn btn-light" onclick="cargarCarpetas(${element.codigo_proyecto});"><img id="icono" src="iconos/svg/si-glyph-briefcase.svg"/>${element.nombre_proyecto}</button>
                    </div>`
                );
            });
        },
        error:function(error){
            console.error(error);
        }
    });
}

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

function cargarCarpetas(codigo_proyecto){
    alert(codigo_proyecto);
}