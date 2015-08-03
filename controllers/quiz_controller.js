
var models = require('../models/models.js');

//Autoload
exports.load = function(req,res,next,quizId){
	models.Quiz.find(quizId).then(
		function(quiz){
			if(quiz){
				req.quiz = quiz;
				next();
			}else{next(new Error('No existe quizId =' + quizId));}

		}).catch(function(error){
			next(error);
		});
};
//GET /quizes:id

exports.show = function(req,res){
		res.render('quizes/show',{quiz:req.quiz, errors: []});
};
//get answer
exports.answer = function(req,res){
	var resultado = 'Incorrecta';
		if (req.query.respuesta === req.quiz.respuesta){
		resultado = 'Correcta';
	} 
	res.render('quizes/answer',{quiz: req.quiz,respuesta: resultado, errors: []});
};
//get quizes con busqueda
exports.index = function(req,res){
    if (req.query.search){
         var busqueda = req.query.search.replace(/\s+/g, "%");
        

         models.Quiz.findAll({where: ["upper(pregunta) like ?", "%" + busqueda.toUpperCase() + "%"],order: 'pregunta ASC'}).then(

        function(quizes){
            res.render('quizes/index.ejs',{quizes:quizes, errors: []});
        }
        ).catch(function(error){next(error);})
        
    }else{
        models.Quiz.findAll().then(
            function(quizes){
            res.render('quizes/index.ejs',{quizes:quizes,errors: []});
        }
        ).catch(function(error) {next(error);});
       
    }
};

/**
exports.index = function(req,res){
	models.Quiz.findAll().then(function(quizes){
		res.render('quizes/index.ejs',{ quizes: quizes});
	}).catch(function(error){next(error);})
};**/
exports.author = function(req,res){
    res.render('author',{autor:'Daniel Puc Aguilar',errors: []});
};

//new
exports.new = function(req,res){
	var quiz = models.Quiz.build(
	{
		pregunta: "Pregunta",resultado: "Respuesta", tema: "Tema"
	});
	res.render('quizes/new',{quiz: quiz, errors: []});
};
// POST /quizes/create
exports.create = function(req,res){
    var quiz = models.Quiz.build(req.body.quiz);
    
    quiz
    .validate()
    .then(
        function(err){
            if(err){
                res.render('quizes/new',{quiz:quiz,errors:err.errors});
            } else {
    // guardar en DB los campos pregunta y respuesta de quiz
    quiz
    .save({fields:["pregunta","respuesta","tema"]})
    .then(function(){res.redirect('/quizes')}) 
    // Redireccion HTTP (URL relativo) lista de preguntas
}
        }
        );
};

//GET EDIT

exports.edit = function(req,res){
    var quiz = req.quiz;
    res.render('quizes/edit', {quiz: quiz, errors: []});
};

// PUT /quizes/:id
exports.update = function(req,res){
    req.quiz.pregunta = req.body.quiz.pregunta;
    req.quiz.respuesta = req.body.quiz.respuesta;
    req.quiz.tema = req.body.quiz.tema;
   
    
    req.quiz
    .validate()
    .then(
        function(err){
            if (err){
                res.render('quizes/edit',{quiz:req.quiz,errors:err.errors});
            }else{
                req.quiz // save : guardar campos preunta y respuesta en BD
                .save({fields:["pregunta","respuesta","tema"]})
                .then( function(){res.redirect('/quizes');});
            } // redireccion a HTTP a lista de preguntas
        }
        );
};

//Delete 
exports.destroy = function(req,res){
    req.quiz.destroy().then(function(){
        res.redirect('/quizes');
    }).catch(function(error){next(error)});
};