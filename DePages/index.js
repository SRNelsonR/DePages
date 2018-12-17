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
});

// Petición para crear un usuario
app.post("/crear-usuario", function(req, res){
    var conexion = mysql.createConnection(credenciales);
    conexion.query(
        "INSERT INTO tbl_usuarios (codigo_genero, codigo_plan, nombre, apellido, correo, nickname, contrasena, fecha_creacion) VALUES (?, ?, ?, ?, ?, ?, ?, '12/11/18')",
        [
            req.body.genero,
            req.body.plan,
            req.body.nombre,
            req.body.apellido,
            req.body.correo,
            req.body.nickname,
            req.body.contrasena
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


app.listen(8001, function(){
    console.log("Servidor levantado con éxito.");
});