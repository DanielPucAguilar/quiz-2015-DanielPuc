var path = require ('path');

//Postgress DATABASE_URL = postgres://user:passwd@host:port/database
//Sqlite DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = ( url[6]||null);
var user = (url[2]||null);
var pwd = (url[3]||null);
var protocol = (url[1]||null);
var dialect = (url[1]||null);
var port = (url[5]||null);
var host = (url[4]||null);
var storage = process.env.DATABASE_STORAGE;
//Cargar modelo ORM
var Sequelize = require('sequelize');
//Usar BBDD SQlite
// Usar BBDD SQlite o Posrtgres:
var sequelize = new Sequelize(DB_name,user,pwd,
                              { 
                                dialect: protocol,
                                protocol:protocol,
                                port:port,
                                host:host, 
                                storage: storage, // solo sqlite
                                omitNull:true // solo postgres
                              }
                              );
//importar la definicion de la tabla quiz
var quiz_path = path.join(__dirname,'quiz');
var Quiz = sequelize.import(quiz_path);

//Importar definicion de la tabla Comment
var comment_path = path.join(__dirname,'comment');
var Comment = sequelize.import(comment_path);

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

exports.Quiz = Quiz;
exports.Comment = Comment;


sequelize.sync().then(function(){
    //success(..) ejecuta el manejador una vez creada la tabla
    Quiz.count().then(function(count){
        if(count===0){ // la tabla se inicializa solo si está vacía
            Quiz.create({ pregunta: 'Capital de Italia',
                         respuesta: 'Roma',
                         tema: 'Otro'
                        });
            Quiz.create({ pregunta: 'Capital de Portugal',
                         respuesta: 'Lisboa',
                         tema:'Otro'
                        })
            .then(function(){console.log('Base de datos inicializada')});
        };
    });
});