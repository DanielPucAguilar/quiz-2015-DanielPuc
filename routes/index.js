var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'QuIZ', errors: [] });
});
//Autoload
router.param('quizId',quizController.load);
router.param('commentId', commentController.load);
/**
router.get('/quizes/question', quizController.question);
router.get('/quizes/answer', quizController.answer);
router.get('/author',quizController.author);
*/
//DEFINICION DE LAS RUTAS DE SESSION
router.get('/login', 						sessionController.new);
router.post('/login',						sessionController.create);
router.get('(/login',						sessionController.destroy);
//Definicion de las rutas de /quizes
router.get('/author',						quizController.author);
router.get('/quizes',						quizController.index);
router.get('/quizes/:quizId(\\d+)',			quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', 	quizController.answer);
router.get('/quizes/new',	sessionController.loginRequired, quizController.new);
router.post('/quizes/create', sessionController.loginRequired,				quizController.create);
router.get('/quizes/:quizId(\\d+)/edit', sessionController.loginRequired,	quizController.edit);
router.put('/quizes/:quizId(\\d+)', sessionController.loginRequired,			quizController.update);
router.delete('/quizes/:quizId(\\d+)', sessionController.loginRequired,		quizController.destroy);

router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments',    commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish',sessionController.loginRequired,commentController.publish);


module.exports = router;
