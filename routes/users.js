const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const connection = require("../config");

// ALL ABOUT USERS

// GET ALL users
router.get("/", (req, res) => {
	connection.query("SELECT * FROM user", (err, results) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).json(results);
		}
	});
});

// GET ALL USERS FOODS
router.get("/foodLists", (req, res) => {
	connection.query("SELECT * FROM user_food", (err, results) => {
		if (err) {
			res.status(500).send("can't show the lists");
		} else {
			res.status(200).json(results);
		}
	});
});

// GET ONE
router.get("/:idUser", (req, res) => {
	const { idUser } = req.params;

	connection.query(
		"SELECT * FROM user WHERE id = ?",
		[idUser],
		(err, results) => {
			if (err) {
				res.status(500).send(err);
			} else if (results.length === 0) {
				res.status(400).send("can't find this user");
			} else {
				res.status(200).json(results);
			}
		}
	);
});

// CREATE ONE user with crypt
router.post("/", (req, res) => {
	const hash = bcrypt.hashSync(req.body.password, 10);

	const formData = {
		email: req.body.email,
		password: hash,
	};

	connection.query("INSERT INTO user SET ?", [formData], (err, _) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.sendStatus(201);
		}
	});
});

// CREATE TOKEN when user connexion is successfull
router.post("/auth", (req, res) => {
	const formData = {
		email: req.body.email,
		password: req.body.password,
	};

	connection.query(
		"SELECT email, password FROM user WHERE email = ?",
		[formData.email],
		(err, result) => {
			if (err) {
				res.status(500).send(err);
			} else {
				// compare inputs
				const isSame = bcrypt.compareSync(
					formData.password,
					result[0].password
				);
				if (!isSame) {
					res.status(401).send(err);
				} else {
					// create token
					jwt.sign({ result }, "secretkey", (err, token) => {
						res.json({ token });
					});
				}
			}
		}
	);
});

// Protected generic access
router.post("/checkToken", verifyToken, (req, res) => {

	jwt.verify(req.token, "secretkey", (err, authData) => {
    if(err) {
      res.status(403).send(err);
    } else {
			// get user ID with email send by jwt
			connection.query('SELECT id from user WHERE email = ?', [authData.result[0].email], (error, result) => {
				if(error) {
						res.status(500).send(error)
				} else {
					res.json({
						message: "login successful",
						userId: result[0].id,
						authData: authData,
						// return id user
					})
				}

			}
			
			)
    }
  })
});

// MODIFY DATAS for ONE user
router.put("/:idUser", (req, res) => {
	const { idUser } = req.params;
	const formData = req.body;

	connection.query(
		"UPDATE user SET ? WHERE id = ?",
		[formData, idUser],
		(err, results) => {
			if (err) {
				res.status(500).send("Can't modify that user");
			} else {
				res.status(200).json(results);
			}
		}
	);
});

// DELETE ONE user
router.delete("/:idUser", (req, res) => {
	const { idUser } = req.params;

	connection.query(
		"DELETE FROM user WHERE id = ?",
		[idUser],
		(err, results) => {
			if (err) {
				res.status(500).send(err);
			} else if (results.length === 0) {
				res.status(400).send("can't delete this user");
			} else {
				res.status(200).json(results);
			}
		}
	);
});


// -- USERS WITH THEIR FOOD --

// GET ALL FOODS from ONE USER
router.get("/:idUser/foodList", (req, res) => {
	const { idUser } = req.params;

	connection.query(
		"SELECT * FROM user_food as uf JOIN user ON user.id = uf.user_id JOIN food ON food.id = uf.food_id WHERE user.id = ?",
		[idUser],
		(err, results) => {
			if (err) {
				res.sendStatus(500);
			} else {
				res.json(results);
			}
		}
	);
});

// ADD ONE FOOD to ONE USER
router.post("/:idUser/foods/:idFood", (req, res) => {
	const { idUser, idFood } = req.params;

	connection.query(
		"INSERT INTO user_food (user_id, food_id) VALUES(?, ?)",
		[idUser, idFood],
		(err, results) => {
			if (err) {
				res.status(500).send("Can't add that food");
			} else {
				res.status(200).json(results);
			}
		}
	);
});

// MODIFY ONE FOOD from ONE USER (allergy)
router.put("/foodList/:idList", (req, res) => {
	const { idList } = req.params;
	const formData = req.body;

	connection.query(
		"UPDATE user_food SET ? WHERE id= ?",
		[formData, idList],
		(err, results) => {
			if (err) {
				res.status(500).send("Can't modify that food");
			} else {
				res.status(200).json(results);
			}
		}
	);
});

// DELETE ONE FOOD from ONE USER
router.delete("/foodList/:idList", (req, res) => {
	const { idList } = req.params;

	connection.query(
		"DELETE from user_food WHERE id= ?",
		[idList],
		(err, results) => {
			if (err) {
				res.status(500).send("Can't delete that food");
			} else {
				res.status(200).json(results);
			}
		}
	);
});

// Functon to verify token
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers["authorization"];
  //Check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    // split header
    const bearer = bearerHeader.split(" ");
    // get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // no access
    res.sendStatus(500);
  }
}

module.exports = router;
