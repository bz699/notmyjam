const express = require('express');
const router = express.Router();
const connection  = require('../config');

// GET ALL foods
router.get('/', (req, res) => {
  connection.query('SELECT * FROM food', (err, result) => {
    if(err) {
      res.status(500).send(err)
    } else {
      res.status(200).json(result)
    }
  })
});

// GET ONE food
router.get('/:idFood', (req, res) => {
  const { idFood } = req.params;

  connection.query('SELECT * FROM food WHERE id = ?', [idFood], (err, result) => {
      if (err) {
          res.status(500).send(err)
      } else if (results.length === 0) {
          res.status(400).send('this food does\'nt exist')
      } else {
          res.status(200).json(result)
      }
  })
});

// ADD ONE food
router.post('/', (req, res) => {

  const formData = req.body;

  connection.query('INSERT INTO food SET ?', formData, (err, results) => {
    if(err) {
      res.status(500).send(err)
    } else {
      res.status(200).json(results)
    }
  })
});

// MODIFY DATAS for ONE food
router.put('/:idFood', (req, res) => {

  const { idFood } = req.params;
  const formData = req.body;

  connection.query('UPDATE food SET ? WHERE id = ?', [formData, idFood], (err, results) => {
    if(err) {
      res.sendStatus(err)
    } else {
      res.status(200).json(results)
    }
  })
})

// DELETE ONE food
router.delete('/:idFood', (req, res) => {
  const { idFood } = req.params;

  connection.query('DELETE FROM food WHERE id = ?', [idFood], (err, result) => {
      if (err) {
          res.status(500).send(err)
      } else if (results.length === 0) {
          res.status(400).send('can\'t delete this food')
      } else {
          res.status(200).json(result)
      }
  })
});



module.exports = router; 