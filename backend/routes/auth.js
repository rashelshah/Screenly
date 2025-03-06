const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");



const JWT_SECRET = "jwt_key";

// ROUTE 1: Creating a user(from models folder) using: POST "/api/auth/createuser" and using express-validator(version: 6.12.0)
// it helps in connecting the user schema to the thunderclient server and checks for errors in name, mail and password.
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success = false;
    //If there are any errors then return Bad Request and the error message.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array() });
    }
    try {
      //Check if the user already exists in the database, if yes then return Bad Request and the error message.
      let user = await User.findOne({ success, email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({success, error: "A user with this email already exists" });
      }
      // Hashing the password by using bcrypt.js
      const salt = await bcrypt.genSaltSync(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      //Creating a new user.
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });
      // creating a jwt token for the user
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);

      
      success = true;
      res.json({ success,authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("An Error Occured");
    }
  }
);
// ROUTE 2: Authenticating the user using: POST "/api/auth/login"
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists({
      min: 5,
    }),
  ],
  async (req, res) => {
    //If there are any errors then return Bad Request and the error message.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      //Get email and password of the user from the body
    const {email, password} = req.body;
    //finding the email of user and if email not found show error
    let user = await User.findOne({email});
    if(!user){
      return res.status(400).json({error: 'Please login with correct credentials'});
    }
    // creating a function to compare the password entered by user. if password is incorrect show error
    const passwordCompare = await bcrypt.compare(password, user.password)
    if(!passwordCompare){
      success = false;
      return res.status(400).json({error: 'Please login with correct credentials'});
    }
      // creating a jwt token for the user
    const data = {
      user: {
        id: user.id,
      },
    };
    const authtoken = jwt.sign(data, JWT_SECRET);
    success =true;
    res.json({success, authtoken });
  }
    catch (error) {
      console.error(error.message);
      res.status(500).send("An Error Occured");
    }
  })

  // ROUTE 3: Get the details of user who is logged in using: POST "/api/auth/getuser"
  router.post(
    "/getuser",fetchuser, async (req, res) => {
      
  try {
    userId = req.user.id;  //Getting the token details from the fetchuser.js file 
    const user = await User.findById(userId).select("-password"); // -password means it should exclude password.
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("An Error Occured");
  }
})
module.exports = router;
