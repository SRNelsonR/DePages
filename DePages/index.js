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
app.get("/cargar-proyectos",function(req,res){
    var conexion = mysql.createConnection(credenciales);
    conexion.query(
        "SELECT codigo_proyecto, id_usuario, codigo_estado, nombre_proyecto, html, css, js, created, updated_at FROM tbl_proyectos where id_usuario = ? and codigo_estado = 1",
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

app.listen(8001, function(){
    console.log("Servidor levantado con éxito.");
});