const express = require('express');
const router = express.Router();
const connection  = require('../config');



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


// ALL FOODS from ONE USER
router.get('/:idUser/foods', (req, res) => {
  const { idUser } = req.params;

  connection.query('SELECT * FROM user_food as uf JOIN user ON user.id = uf.user_id JOIN food ON food.id = uf.food_id WHERE user.id = ?', [idUser], (err, results) => {
    if(err) {
      res.sendStatus(500)
    } else {
      res.json(results)
    }
  })
});



// ADD ONE user
router.post('/', (req, res) => {

  const formData = req.body;

  connection.query('INSERT INTO user SET ?', formData, (err, results) => {
    if(err) {
      res.status(500).send(err)
    } else {
      res.status(200).json(results)
    }
  })
})


// MODIFY DATAS for ONE user
router.put('/:idUser', (req, res) => {

  const { idUser } = req.params;
  const formData = req.body;

  connection.query('UPDATE user SET ? WHERE id = ?', [formData, idUser], (err, results) => {
    if(err) {
      res.sendStatus(err)
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


module.exports = router;
