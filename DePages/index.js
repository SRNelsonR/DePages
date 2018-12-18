var express = require("express");
var session = require("express-session");
var mysql = require("mysql");
var bodyParser = require("body-parser");

var app = express();

var credenciales = {
    host:"localhost",
    user:"root",
    password:"",
    port:3306,
    database:"db_depages"
};

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({secret:"ASDFE$%#%",resave:true, saveUninitialized:true}));

//Verificar si existe una variable de sesion para poner publica la carpeta public-depages
var publicDepages = express.static("public-depages");
app.use(
    function(req,res,next){
        if (req.session.correoUsuario){
            //Significa que el usuario si esta logueado
            publicDepages(req,res,next);
        }
        else
            return next();
    }
);

/*----------------------Peticiones para Registrarse-----------------------------------------------------*/

//Petición para cargar los generos
app.get("/cargar-genero", function(req, res){
    var conexion = mysql.createConnection(credenciales);
    conexion.query(
        "SELECT codigo_genero, nombre_genero FROM tbl_generos;",
        [],
        function(error, data, fields){
            res.send(data);
            res.end();
        }    
    );
    conexion.end();
});

//Peticióno para cargar los planes
app.get("/cargar-plan", function(req, res){
    var conexion = mysql.createConnection(credenciales);
    conexion.query(
        "select codigo_plan, nombre_plan, cantidad from tbl_planes",
        [],
        function(error, data, fields){
            res.send(data);
            res.end();
        }    
    );
    conexion.end();
});

// Petición para crear un usuario
app.post("/crear-usuario", function(req, res){
    var conexion = mysql.createConnection(credenciales);
    conexion.query(
        "INSERT INTO tbl_usuarios (codigo_genero, codigo_plan, nombre, apellido, correo, nickname, contrasena, fecha_creacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
            req.body.genero,
            req.body.plan,
            req.body.nombre,
            req.body.apellido,
            req.body.correo,
            req.body.nickname,
            req.body.contrasena,
            req.body.fecha
        ],
        function(error, data, fields){
            if (error){
                res.send(error);
                res.end();
            }else{
                res.send(data);
                res.end();
            }
        }
    );
    conexion.end();
});

/*----------------------Peticiones para Login-----------------------------------------------------*/
//Verificar que el usuario exista y creacion de variables de sesión
app.post("/login", function(req, res){
    var conexion = mysql.createConnection(credenciales);
    conexion.query(
        "select id_usuario, codigo_genero, codigo_plan, nombre, apellido, correo, nickname, contrasena, fecha_creacion from tbl_usuarios where correo = ? and contrasena = ?",
        [
            req.body.correo,
            req.body.contrasena
        ],
        function(error, data, fields){
            if (error){
                res.send(error);
                res.end();
            }else{
                if (data.length==1){
                    req.session.codigoUsuario = data[0].id_usuario;
                    req.session.correoUsuario = data[0].correo;
                    req.session.codigoPlan = data[0].codigo_plan;
                    req.session.nombre = data[0].nombre;
                    req.session.apellido = data[0].apellido;
                    req.session.nickname = data[0].nickname;
                }
                res.send(data);
                res.end();
            }
        }    
    );
    conexion.end();
});

app.get("/obtener-session",function(req,res){
    var datosSesion = {
        codigoUsuario:req.session.codigoUsuario,
        correo:req.session.correoUsuario,
        tipoPlan:req.session.codigoPlan,
        nombre:req.session.nombre,
        apellido:req.session.apellido,
        nickname:req.session.nickname
    }
    res.send(datosSesion);
    res.end();
});

app.get("/cerrar-session",function(req,res){
    req.session.destroy();
    res.send("Sesion eliminada");
    res.end();
});

/*----------------------Peticiones para Home.html-----------------------------------------------------*/

//Relacionado a proyectos
app.get("/cargar-proyectos",function(req,res){
    var conexion = mysql.createConnection(credenciales);
    conexion.query(
        "SELECT codigo_proyecto, id_usuario, codigo_estado, nombre_proyecto, created, updated_at FROM tbl_proyectos where id_usuario = ? and codigo_estado = 1",
        [
            req.query.codigo_usuario
        ],
        function(error, data, fields){
            res.send(data);
            res.end();
        }    
    );
    conexion.end();
});

app.post("/modificar-proyecto", function(req, res){
    var conexion = mysql.createConnection(credenciales);
    conexion.query(
        "UPDATE tbl_proyectos SET nombre_proyecto = ?, updated_at = ? WHERE codigo_proyecto = ?",
        [
            req.body.nombre,
            req.body.fecha,
            req.body.codigo_proyecto
        ],
        function(error, data, fields){
            res.send(data);
        }
    );
    conexion.end();
});

app.post("/desactivar-proyecto", function(req, res){
    var conexion = mysql.createConnection(credenciales);
    conexion.query(
        "UPDATE tbl_proyectos SET codigo_estado = 2, updated_at = ? WHERE codigo_proyecto = ?",
        [
            req.body.fecha,
            req.body.codigo_proyecto
        ],
        function(error, data, fields){
            res.send(data);
        }
    );
    conexion.end();
});

app.post("/agregar-proyecto", function(req, res){
    var conexion = mysql.createConnection(credenciales);
    conexion.query(
        "INSERT INTO tbl_proyectos (id_usuario, codigo_estado, nombre_proyecto, created, updated_at) VALUES (?, 1, ?, ?, ?)",
        [
            req.body.usuario,
            req.body.nombre_proyecto,
            req.body.fecha_creacion,
            req.body.fecha_actualizacion
        ],
        function(error, data, fields){
            res.send(data);
        }
    );
    conexion.end();
});

//Relacionado a carpetas
app.get("/cargar-carpetas",function(req,res){
    var conexion = mysql.createConnection(credenciales);
    conexion.query(
        "SELECT codigo_carpeta, id_usuario, codigo_estado, codigo_proyecto, nombre, descripcion FROM tbl_carpetas where codigo_proyecto=? and codigo_estado = 1",
        [
            req.query.codigo_proyecto
        ],
        function(error, data, fields){
            res.send(data);
            res.end();
        }    
    );
    conexion.end();
});

app.post("/modificar-carpeta", function(req, res){
    var conexion = mysql.createConnection(credenciales);
    conexion.query(
        "UPDATE tbl_carpetas SET nombre = ?, descripcion = ?, actualizado = ? WHERE codigo_carpeta = ?",
        [
            req.body.nombre,
            req.body.descripcion,
            req.body.actualizacion,
            req.body.codigo_carpeta
        ],
        function(error, data, fields){
            res.send(data);
        }
    );
    conexion.end();
});

app.post("/desactivar-carpeta", function(req, res){
    var conexion = mysql.createConnection(credenciales);
    conexion.query(
        "UPDATE tbl_carpetas SET codigo_estado = 2, actualizado = ? WHERE codigo_carpeta = ?",
        [
            req.body.actualizacion,
            req.body.codigo_carpeta
        ],
        function(error, data, fields){
            res.send(data);
        }
    );
    conexion.end();
});

app.post("/agregar-carpeta", function(req, res){
    var conexion = mysql.createConnection(credenciales);
    conexion.query(
        "INSERT INTO tbl_carpetas (id_usuario, codigo_estado, codigo_proyecto, nombre, descripcion, creado, actualizado) VALUES (?, 1, ?, ?, ?, ?, ?);",
        [
            req.body.usuario,
            req.body.codigo_proyecto,
            req.body.nombre,
            req.body.descripcion,
            req.body.fecha_creacion,
            req.body.fecha_actualizacion
        ],
        function(error, data, fields){
            res.send(data);
        }
    );
    conexion.end();
});

/* Gestión de Archivos */
app.get("/cargar-archivos",function(req,res){
    var conexion = mysql.createConnection(credenciales);
    conexion.query(
        "SELECT codigo_tipo_archivo, codigo_carpeta, codigo_estado, nombre_tipo_archivo, contenido FROM tbl_tipo_archivo where codigo_carpeta = ? and codigo_estado = 1",
        [
            req.query.codigo_carpeta
        ],
        function(error, data, fields){
            res.send(data);
            res.end();
        }    
    );
    conexion.end();
});

app.post("/modificar-archivo", function(req, res){
    var conexion = mysql.createConnection(credenciales);
    conexion.query(
        "UPDATE tbl_tipo_archivo SET nombre_tipo_archivo = ? WHERE codigo_tipo_archivo = ?",
        [
            req.body.nombre,
            req.body.codigo_tipo_archivo
        ],
        function(error, data, fields){
            res.send(data);
        }
    );
    conexion.end();
});

app.listen(8001, function(){
    console.log("Servidor levantado con éxito.");
});