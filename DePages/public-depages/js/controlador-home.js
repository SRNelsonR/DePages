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

/* Gestión de Proyectos */
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

                        <button class="btn btn-success" data-toggle="modal" data-target="#modificar-proyecto" onclick="gestionarProyecto(${element.codigo_proyecto});"><img id="icono" src="iconos/svg/si-glyph-edit.svg"/></button>

                        <input id="identificador-proyecto-${element.codigo_proyecto}" type="hidden" value="${element.codigo_proyecto}">
                    </div>`
                );
            });
        },
        error:function(error){
            console.error(error);
        }
    });
}

$("#btn-modificar-proyecto").click(function(){
    var date = new Date();
    var fecha = date.getFullYear() + "-"   + (date.getMonth()+1) + "-" + date.getDate();
    var datos = "nombre=" + $("#proyecto-nuevo-nombre").val() + "&fecha=" + fecha + "&codigo_proyecto=" + $("#gestionar").val();
    $.ajax({
        url:"/modificar-proyecto",
        method:"POST",
        data:datos,
        dataType:"json",
        success:function(res){
            //console.log(res);
            $("#proyecto-nuevo-nombre").val("");
            $("#contenedor-proyectos").html("");
            $("#creado").fadeIn().delay(3000).fadeOut();
            cargarProyectos($("#codigo-usuario").val());
        },
        error:function(error){
            console.error(error);
        }
    });
});

$("#btn-eliminar-proyecto").click(function(){
    var date = new Date();
    var fecha = date.getFullYear() + "-"   + (date.getMonth()+1) + "-" + date.getDate();
    var datos = "codigo_proyecto=" + $("#gestionar").val() + "&fecha=" + fecha;
    $.ajax({
        url:"/desactivar-proyecto",
        method:"POST",
        data:datos,
        dataType:"json",
        success:function(res){
            $("#proyecto-nuevo-nombre").val("");
            $("#contenedor-proyectos").html("");
            cargarProyectos($("#codigo-usuario").val());
        },
        error:function(error){
            console.error(error);
        }
    });
});


function gestionarProyecto(codigo_proyecto){
    $("#gestionar").val(codigo_proyecto);
}

$("#modal-agregar").click(function(){
    $("#agregar").val($("#codigo-usuario").val());
});

$("#btn-agregar-proyecto").click(function(){
    var date = new Date();
    var fecha = date.getFullYear() + "-"   + (date.getMonth()+1) + "-" + date.getDate();
    var datos = "usuario=" + $("#codigo-usuario").val() + "&nombre_proyecto=" + $("#nuevo_proyecto").val() + "&fecha_creacion=" + fecha + "&fecha_actualizacion=" + fecha;
    $.ajax({
        url:"/agregar-proyecto",
        method:"POST",
        data:datos,
        dataType:"json",
        success:function(res){
            $("#nuevo_proyecto").val("");
            $("#contenedor-proyectos").html("");
            $("#creado-proyecto").fadeIn().delay(3000).fadeOut();
            cargarProyectos($("#codigo-usuario").val());
        },
        error:function(error){
            console.error(error);
        }
    });
});

/* Gestión de Carpetas */
function cargarCarpetas(codigo_proyecto){
    //$("#carpetas").fadeIn();
    $("#carpetas-de-proyecto").val(codigo_proyecto);
    $("#contenedor-carpetas").html("");
    var datos = "codigo_proyecto=" + codigo_proyecto;
    $.ajax({
        url:"/cargar-carpetas",
        method:"GET",
        data:datos,
        dataType:"json",
        success:function(res){
            console.log(res);
            res.forEach(function(element){
                $("#contenedor-carpetas").append(
                    `<div id="carpeta-info" class="col-lg-12">
                        <button class="btn btn-light" onclick="cargarArchivos(${element.codigo_carpeta});"><img id="icono" src="iconos/svg/si-glyph-folder-remove.svg"/>${element.nombre}</button>
        
                        <button class="btn btn-success" data-toggle="modal" data-target="#gestionar-carpeta" onclick="gestionarArchivos(${element.codigo_carpeta});"><img id="icono" src="iconos/svg/si-glyph-edit.svg"/></button>
        
                        <input id="identificador-carpeta-${element.codigo_carpeta}" type="hidden" value="${element.codigo_carpeta}">
                    </div>`
                );
            });
        },
        error:function(error){
            console.error(error);
        }
    });
}

function gestionarCarpetas(codigo_carpeta){
    $("#agregar-carpeta").val(codigo_carpeta);
}

$("#btn-modificar-carpeta").click(function(){
    var date = new Date();
    var fecha = date.getFullYear() + "-"   + (date.getMonth()+1) + "-" + date.getDate();
    var datos = "nombre=" + $("#nueva-carpeta").val() + "&codigo_carpeta=" + $("#agregar-carpeta").val() + "&descripcion=" + $("#txta-descripcion").val() + "&actualizacion=" + fecha;
    $.ajax({
        url:"/modificar-carpeta",
        method:"POST",
        data:datos,
        dataType:"json",
        success:function(res){
            console.log(res);
            $("#modificada-carpeta").fadeIn().delay(3000).fadeOut();
            $("#nueva-carpeta").val("");
            $("#txta-descripcion").val("");
            cargarCarpetas($("#carpetas-de-proyecto").val());
        },
        error:function(error){
            console.error(error);
        }
    });
});

$("#btn-eliminar-carpeta").click(function(){
    var date = new Date();
    var fecha = date.getFullYear() + "-"   + (date.getMonth()+1) + "-" + date.getDate();
    var datos = "codigo_carpeta=" + $("#agregar-carpeta").val() + "&actualizacion=" + fecha;
    $.ajax({
        url:"/desactivar-carpeta",
        method:"POST",
        data:datos,
        dataType:"json",
        success:function(res){
            console.log(res);
            $("#eliminada-carpeta").fadeIn().delay(3000).fadeOut();
            $("#nueva-carpeta").val("");
            $("#txta-descripcion").val("");
            cargarCarpetas($("#carpetas-de-proyecto").val());
        },
        error:function(error){
            console.error(error);
        }
    });
});

$("#agregar-carpeta-ventana").click(function(){
    $("#agregar-modal-carpeta").val($("#codigo-usuario").val());
});

$("#btn-agregar-carpeta").click(function(){
    var date = new Date();
    var fecha = date.getFullYear() + "-"   + (date.getMonth()+1) + "-" + date.getDate();
    var datos = "usuario=" + $("#agregar-modal-carpeta").val() + "&codigo_proyecto=" + $("#carpetas-de-proyecto").val() + "&nombre=" + $("#nuevo_carpeta").val() + "&descripcion=" + $("#txta-descripcion-agregar").val() + "&fecha_creacion=" + fecha + "&fecha_actualizacion=" + fecha;
    //alert(datos);
    $.ajax({
        url:"/agregar-carpeta",
        method:"POST",
        data:datos,
        dataType:"json",
        success:function(res){
            $("#nuevo_carpeta").val("");
            $("#txta-descripcion-agregar").val("");
            $("#contenedor-carpetas").html("");
            $("#creado-carpeta").fadeIn().delay(3000).fadeOut();
            cargarCarpetas($("#carpetas-de-proyecto").val());
        },
        error:function(error){
            console.error(error);
        }
    });
});

/* Gestion de Archivos */
function cargarArchivos(codigo_carpeta){
    $("#archivos-de-carpeta").val(codigo_carpeta);
    $("#contenedor-archivos").html("");
    var datos = "codigo_carpeta=" + codigo_carpeta;
    $.ajax({
        url:"/cargar-archivos",
        method:"GET",
        data:datos,
        dataType:"json",
        success:function(res){
            console.log(res);
            res.forEach(function(element){
                $("#contenedor-archivos").append(
                    `<div id="carpeta-info" class="col-lg-12">
                        <button class="btn btn-light"><img id="icono" src="iconos/svg/si-glyph-folder-remove.svg"/>${element.nombre_tipo_archivo}</button>
        
                        <button class="btn btn-success" data-toggle="modal" data-target="#gestionar-archivo" onclick="gestionarArchivos(${element.codigo_tipo_archivo});"><img id="icono" src="iconos/svg/si-glyph-edit.svg"/></button>
        
                        <input id="identificador-archivo-${element.codigo_tipo_archivo}" type="hidden" value="${element.codigo_tipo_archivo}">
                    </div>`
                );
            });
        },
        error:function(error){
            console.error(error);
        }
    });
}

function gestionarArchivos(codigo_archivo){
    $("#agregar-archivo").val(codigo_archivo);
}

$("#btn-modificar-archivo").click(function(){
    var datos = "nombre=" + $("#nuevo-archivo").val() + "&codigo_tipo_archivo=" + $("#agregar-archivo").val();
    $.ajax({
        url:"/modificar-archivo",
        method:"POST",
        data:datos,
        dataType:"json",
        success:function(res){
            $("#modificado-archivo").fadeIn().delay(3000).fadeOut();
            $("#nuevo-archivo").val("");
            cargarArchivos($("#archivos-de-carpeta").val());
        },
        error:function(error){
            console.error(error);
        }
    });
});

/* Cierre de Sesión */
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