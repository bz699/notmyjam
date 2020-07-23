const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');

const connection  = require('../config');

// ALL ABOUT USERS

// GET ALL users
router.get('/', (req, res) => {
  connection.query('SELECT * FROM user', (err, results) => {
    if(err) {
      res.status(500).send(err)
    } else {
      res.status(200).json(results)
    }
  })
});

// GET ALL USERS FOODS
router.get('/foodLists', (req,res) => {
  connection.query('SELECT * FROM user_food', (err, results) => {
    if(err) {
      res.status(500).send('can\'t show the lists')
    } else {
      res.status(200).json(results)
    }
  })
});

// GET ONE user
router.get('/:idUser', (req, res) => {
  const { idUser } = req.params;

  connection.query('SELECT * FROM user WHERE id = ?', [idUser], (err, results) => {
      if (err) {
          res.status(500).send(err)
      } else if (results.length === 0) {
          res.status(400).send('can\'t find this user')
      } else {
          res.status(200).json(results)
      }
  })
});

// CREATE ONE user
router.post('/', (req, res) => {

  const hash = bcrypt.hashSync(req.body.password, 10);
  
  const formData = {
    email: req.body.email,
    password: hash
  };

  connection.query('INSERT INTO user SET ?', [formData], (err, results) => {
    if(err) {
      res.status(500).send(err);
    } else {
      res.sendStatus(201);
    }
  })
})


// MODIFY DATAS for ONE user
router.put('/:idUser', (req, res) => {

  const { idUser } = req.params;
  const formData = req.body;

  connection.query('UPDATE user SET ? WHERE id = ?', [formData, idUser], (err, results) => {
    if(err) {
      res.status(500).send('Can\'t modify that user');
    } else {
      res.status(200).json(results)
    }
  })
})

// DELETE ONE user
router.delete('/:idUser', (req, res) => {
  const { idUser } = req.params;

  connection.query('DELETE FROM user WHERE id = ?', [idUser], (err, results) => {
      if (err) {
          res.status(500).send(err)
      } else if (results.length === 0) {
          res.status(400).send('can\'t delete this user')
      } else {
          res.status(200).json(results)
      }
  })
});


// USERS WITH THEIR FOOD

// GET ALL FOODS from ONE USER
router.get('/:idUser/foodList', (req, res) => {
  const { idUser } = req.params;

  connection.query('SELECT * FROM user_food as uf JOIN user ON user.id = uf.user_id JOIN food ON food.id = uf.food_id WHERE user.id = ?', [idUser], (err, results) => {
    if(err) {
      res.sendStatus(500)
    } else {
      res.json(results)
    }
  })
});

// ADD ONE FOOD to ONE USER
router.post('/:idUser/foods/:idFood', (req, res) => {
  const { idUser, idFood } = req.params;

  connection.query('INSERT INTO user_food (user_id, food_id) VALUES(?, ?)', [idUser, idFood], (err, results) => {
      if (err) {
          res.status(500).send('Can\'t add that food');
      } else {
        res.status(200).json(results)
      }
  })
});

// MODIFY ONE FOOD from ONE USER (allergy)
router.put('/foodList/:idList', (req, res) => {
  const { idList } = req.params;
  const formData = req.body

  connection.query('UPDATE user_food SET ? WHERE id= ?', [formData, idList], (err, results) => {
      if (err) {
          res.status(500).send('Can\'t modify that food');
      } else {
        res.status(200).json(results)
      }
  })
});

// DELETE ONE FOOD from ONE USER
router.delete('/foodList/:idList', (req, res) => {
  const { idList } = req.params;

  connection.query('DELETE from user_food WHERE id= ?', [idList], (err, results) => {
      if (err) {
          res.status(500).send('Can\'t delete that food');
      } else {
        res.status(200).json(results)
      }
  })
});

module.exports = router;
