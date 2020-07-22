const express = require('express');
const router = express.Router();
const connection  = require('../config');

// GET ALL diets
router.get('/', (req, res) => {
  connection.query('SELECT * FROM diet', (err, results) => {
    if(err) {
      res.status(500).send(err)
    } else {
      res.status(200).json(results)
    }
  })
});

// GET ONE diet
router.get('/:idDiet', (req, res) => {
  const { idDiet } = req.params;

  connection.query('SELECT * FROM diet WHERE id = ?', [idDiet], (err, results) => {
      if (err) {
          res.status(500).send(err)
      } else if (results.length === 0) {
          res.status(400).send('this diet does\'nt exist')
      } else {
          res.status(200).json(results)
      }
  })
});

// ADD ONE diet
router.post('/', (req, res) => {

  const formData = req.body;

  connection.query('INSERT INTO diet SET ?', formData, (err, results) => {
    if(err) {
      res.status(500).send(err)
    } else {
      res.status(200).json(results)
    }
  })
});

// MODIFY DATAS for ONE diet
router.put('/:idDiet', (req, res) => {

  const { idDiet } = req.params;
  const formData = req.body;

  connection.query('UPDATE diet SET ? WHERE id = ?', [formData, idDiet], (err, results) => {
    if(err) {
      res.sendStatus(err)
    } else {
      res.status(200).json(results)
    }
  })
})


// DELETE ONE diet
router.delete('/:idDiet', (req, res) => {
  const { idDiet } = req.params;

  connection.query('DELETE FROM diet WHERE id = ?', [idDiet], (err, results) => {
      if (err) {
          res.status(500).send(err)
      } else if (results.length === 0) {
          res.status(400).send('can\'t delete this diet')
      } else {
          res.status(200).json(results)
      }
  })
});



module.exports = router; 
