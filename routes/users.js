var express = require('express');
var router = express.Router();
var moment = require("moment");
// import global message 
var GM = require("./globalMessage");

// import connection
var db = require("./connection");

// import authentication 
var authentication = require("./authentication");
const { response } = require('../app');

/* GET  */
router.get('/', function (req, res, next) {
  res.send('Welcome to No Let Sublet');
});


// Add user
router.post("/addUser", async function (req, res, next) {
  try {
    if (!req.body.firstName) {
      res.status(500).json({ "response": "0", "message": GM.firstNameUndefiend })
    } else if (!req.body.lastName) {
      res.status(500).json({ "response": "0", "message": GM.lastUndefiend })
    } else if (!req.body.email) {
      res.status(500).json({ "response": "0", "message": GM.emailUndefiend })
    } else if (!req.body.password) {
      res.status(500).json({ "response": "0", "message": GM.passwordUndefiend })
    } else if (!req.body.userType) {
      res.status(500).json({ "response": "0", "message": GM.userTypeUndefiend })
    } else if (!req.body.loginUserId) {
      res.status(500).json({ "response": "0", "message": GM.authenticUserIdUndefiend })
    } else {
      checkUserAvailability(req, done => {
        if (done.response == '1') {
          addSingleUser(req, response => {
            if (response.response == "1") {
              res.status(200).json({ "response": "1", "message": GM.addUserSuccess, "data": response.data });
            } else {
              res.status(500).json({ "response": "0", "message": response.message, "data": "" });
            }
          })
        } else {
          res.status(500).json({ "response": "0", "message": done.message, "data": "" });
        }
      })
    }

  } catch (err) {
    res.status(500).json({ "response": "0", "message": err.message });
  }
});

// Update user
router.post("/updateUser", async function (req, res, next) {
  try {
    if (!req.body.firstName) {
      res.status(500).json({ "response": "0", "message": GM.firstNameUndefiend })
    } else if (!req.body.lastName) {
      res.status(500).json({ "response": "0", "message": GM.lastUndefiend })
    } else if (!req.body.email) {
      res.status(500).json({ "response": "0", "message": GM.emailUndefiend })
    } else if (!req.body.userType) {
      res.status(500).json({ "response": "0", "message": GM.userTypeUndefiend })
    } else if (!req.body.id) {
      res.status(500).json({ "response": "0", "message": GM.userIdUndefiend })
    } else if (!req.body.loginUserId) {
      res.status(500).json({ "response": "0", "message": GM.authenticUserIdUndefiend })
    } else {
      var updateUser = await db.usersRef.child(req.body.id).set({
        "firstName": req.body.firstName,
        "lastName": req.body.lastName,
        "email": req.body.email,
        "userType": req.body.userType,
        "isDeleted": 0,
        "updatedAt": moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        "updatedBy": req.body.loginUserId,
        "isActive": req.body.isActive
      });
      res.status(200).json({ "response": "1", "message": GM.updateUserSuccess, "data": updateUser });
    }
  } catch (err) {
    res.status(500).json({ "response": "0", "message": err.message });
  }
});

// List user
router.post("/listUser", async function (req, res, next) {
  try {
    db.usersRef.orderByChild('isDeleted').equalTo(0).on('value', async function (snapshot) {
      var users = snapshot.val();
      var filteredUser = [];
      await Object.keys(users).forEach((key) => {
        console.log('mail: ' + users[key].email);
        users[key].id = key
        filteredUser.push(users[key]);
        console.log(users[key])
      });

      res.status(200).json({ "response": "1", "message": GM.success, "data": filteredUser });
    });
  } catch (err) {
    res.status(500).json({ "response": "0", "message": err.message });
  }
});

// Delete user
router.post("/deleteUser", async function (req, res, next) {
  try {
    if (!req.body.id) {
      res.status(500).json({ "response": "0", "message": GM.userIdUndefiend })
    } else {
      var deleteUser = await db.usersRef.child(req.body.id).update({
        "isDeleted": 1
      });
      res.status(200).json({ "response": "1", "message": GM.deleteUserSuccess, "data": deleteUser });
    }
  } catch (err) {
    res.status(500).json({ "response": "0", "message": err.message });
  }
});

// Add single user 
async function addSingleUser(req, done) {
  try {
    var addUser = await db.usersRef.push({
      "firstName": req.body.firstName,
      "lastName": req.body.lastName,
      "email": req.body.email,
      "password": authentication.encrypt(req.body.password),
      "userType": req.body.userType,
      "isDeleted": 0,
      "createdAt": moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      "updatedAt": moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      "updatedBy": req.body.loginUserId,
      "isActive": req.body.isActive
    });
    done({ "response": "1", "message": "Succcess", "data": addUser });
  } catch (err) {
    done({ "response": "0", "message": err.message });
  }
}

// Check user is already available or not
async function checkUserAvailability(req, done) {
  try {
    var user;
    db.usersRef.orderByChild('email').equalTo(req.body.email).on('value', await function (snapshot) {
      user = snapshot.val()

    });
    if (user) {
      await Object.keys(user).forEach(async (key) => {
        console.log("Delete", user[key].isDeleted);
        if (user[key].isDeleted == 1) {
          done({ "response": "1" })
        } else {
          done({ "response": "0", "message": GM.userAlreadyExist })
        }
      })
    } else {
      done({ "response": "1" })
    }
  } catch (err) {
    done({ "response": "0", "message": err.message })
  }

}
module.exports = router;
