
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
		res.render('quizes/show',{quiz:req.quiz});
};
//get answer
exports.answer = function(req,res){
	var resultado = 'Incorrecta';
		if (req.query.respuesta === req.quiz.respuesta){
		resultado = 'Correcta';
	} 
	res.render('quizes/answer',{quiz: req.quiz,respuesta: resultado});
};
//get quizes con busqueda
exports.index = function(req,res){
    if (req.query.search){
         var busqueda = req.query.search.replace(/\s+/g, "%");
        

         models.Quiz.findAll({where: ["upper(pregunta) like ?", "%" + busqueda.toUpperCase() + "%"],order: 'pregunta ASC'}).then(

        function(quizes){
            res.render('quizes/index',{quizes:quizes, errors: []});
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
		pregunta: "Pregunta",resultado: "Respuesta"
	});
	res.render('quizes/new',{quiz: quiz});
};
//create
exports.create = function(req,res){
	var quiz = models.Quiz.build(req.body.quiz);

	quiz
	.validate()
	.then(
		function(err){
			if (err){
				res.render('quizes/new',{quiz:quiz, errors: err.errors});
			}else{
				quiz.save({fields: ["pregunta", "respuesta"]}).then(function(){
		res.reditect('/quizes')})
			}
		});
};