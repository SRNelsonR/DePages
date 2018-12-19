$(document).ready(function(){
    $.ajax({
        url:"/obtener-session",
        method:"GET",
        dataType:"json",
        success:function(res){
            $("#usuario-nickname").val(res.nickname);
            $("#codigo-usuario").val(res.codigoUsuario);
            cargarSelectCarpetas(res.codigoUsuario)
        },
        error:function(error){
            console.error(error);
        }
    });
});

function cargarSelectCarpetas(codigo_usuario){
    var datos = "usuario=" + codigo_usuario;
    $.ajax({
        url:"/cargar-select-carpetas",
        method:"GET",
        data:datos,
        dataType:"json",
        success:function(res){
            res.forEach(function(element) {
                $("#slc-carpeta").append(
                    `<option value="${element.codigo_carpeta}">${element.nombre}</option>`
                );
            });
        },
        error:function(error){
            console.error(error);
        }
    });
}

$("#slc-carpeta").change(function(){
    cargarEditores();
});

function cargarEditores(){
    var datos = "codigo_carpeta=" + $("#slc-carpeta").val();
    $.ajax({
        url:"/cargar-editores",
        method:"GET",
        data:datos,
        dataType:"json",
        success:function(res){
            console.log(res);
            if(res.length == 0){
                //alert("Vacio");
                $("#txta-html").val("");
                $("#txta-css").val("");
                $("#txta-js").val("");
                $("#btn-guardar-edicion").fadeOut();
                $("#btn-crear-edicion").fadeIn();
            } else{
                res.forEach(function(element) {
                    if(element.nombre_tipo_archivo == "html")
                        $("#txta-html").val(element.contenido);
                    else if (element.nombre_tipo_archivo == "css")
                        $("#txta-css").val(element.contenido);
                    else if(element.nombre_tipo_archivo == "js")
                        $("#txta-js").val(element.contenido);
                });
                $("#btn-guardar-edicion").fadeIn();
                $("#btn-crear-edicion").fadeOut();
            }
        },
        error:function(error){
            console.error(error);
        }
    });
}

/* Actualizar contenido de la carpeta seleccionada */
$("#btn-guardar-edicion").click(function(){
    peticionGuardarHTML();
    peticionGuardarCSS();
    peticionGuardarJS();
});

function peticionGuardarHTML(){
    var datos = `contenido=${$("#txta-html").val()}&codigo_carpeta=${$("#slc-carpeta").val()}&nombre_tipo_archivo=html`;
    $.ajax({
        url:"/guardar-archivos",
        method:"POST",
        data:datos,
        dataType:"json",
        success:function(res){
            cargarEditores();
        },
        error:function(error){
            console.error(error);
        }
    });
}

function peticionGuardarCSS(){
    var datos = `contenido=${$("#txta-css").val()}&codigo_carpeta=${$("#slc-carpeta").val()}&nombre_tipo_archivo=css`;
    $.ajax({
        url:"/guardar-archivos",
        method:"POST",
        data:datos,
        dataType:"json",
        success:function(res){
            cargarEditores();
        },
        error:function(error){
            console.error(error);
        }
    });
}

function peticionGuardarJS(){
    var datos = `contenido=${$("#txta-js").val()}&codigo_carpeta=${$("#slc-carpeta").val()}&nombre_tipo_archivo=js`;
    $.ajax({
        url:"/guardar-archivos",
        method:"POST",
        data:datos,
        dataType:"json",
        success:function(res){
            cargarEditores();
        },
        error:function(error){
            console.error(error);
        }
    });
}

$("#btn-crear-edicion").click(function(){
    peticionCrearHTML();
    peticionCrearCSS();
    peticionCrearJS();
});

function peticionCrearHTML(){
    var datos = `codigo_carpeta=${$("#slc-carpeta").val()}&nombre_tipo_archivo=html&contenido=${$("#txta-html").val()}`;
    $.ajax({
        url:"/crear-archivos",
        method:"POST",
        data:datos,
        dataType:"json",
        success:function(res){
            cargarEditores();
        },
        error:function(error){
            console.error(error);
        }
    });
}

function peticionCrearCSS(){
    var datos = `codigo_carpeta=${$("#slc-carpeta").val()}&nombre_tipo_archivo=css&contenido=${$("#txta-css").val()}`;
    $.ajax({
        url:"/crear-archivos",
        method:"POST",
        data:datos,
        dataType:"json",
        success:function(res){
            cargarEditores();
        },
        error:function(error){
            console.error(error);
        }
    });
}

function peticionCrearJS(){
    var datos = `codigo_carpeta=${$("#slc-carpeta").val()}&nombre_tipo_archivo=js&contenido=${$("#txta-js").val()}`;
    $.ajax({
        url:"/crear-archivos",
        method:"POST",
        data:datos,
        dataType:"json",
        success:function(res){
            cargarEditores();
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