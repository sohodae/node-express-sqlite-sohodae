var express = require('express');
var app = express();

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

const Comments = sequelize.define('Comments', {
  // Model attributes are defined here
  content: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  // Other model options go here
});

(async () => {
  await Comments.sync();
})();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get('/', async function(req, res) {
  const comments = await Comments.findAll();
  res.render('index',{ comments: comments });
});

app.post('/create', async function(req, res) {
  console.log(req.body);
  const { content } = req.body;

  await Comments.create({ content: content });
  
  res.redirect('/');
});

app.post('/update/:id', async function(req, res) {
  // console.log(req.body);
  // console.log(req.params);
  const { content } = req.body;
  const { id } = req.params;
  
  // Change everyone without a last name to "Doe"
  await Comments.update({ content: content }, {
    where: {
      id: id
    }
  });

  // res.send('hi');
  res.redirect('/');
});

app.post('/delete/:id', async function(req, res) {

  const { id } = req.params;

  await Comments.destroy({
    where: {
      id: id
    }
  });

  res.redirect('/');
});

app.listen(8080);
console.log('Server is listening on port 8080');