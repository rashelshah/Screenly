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



{/*const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { createClient } = require("@supabase/supabase-js");
require('dotenv').config({ path: './backend/.env' });
// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);
//create a new user using Supabase: POST "/api/auth/createuser"
router.post(
  "/createuser",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be at least 6 characters").isLength({ min: 6 }),
    body("name", "Name is required").exists(),
  ],
  async (req, res) => {
    const { email, password, name } = req.body;

    try {
      // Additional email validation
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      // Sign up user
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: { name },
          emailRedirectTo: `${process.env.FRONTEND_URL}/auth/callback`
        }
      });

      if (error) throw error;

      // Create profile (with RLS-compliant query)
      const { error: dbError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: data.user.email,
          name: name
        });

      if (dbError) {
        await supabase.auth.admin.deleteUser(data.user.id);
        throw dbError;
      }

      res.json({ 
        success: true,
        user: data.user,
        session: data.session 
      });

    } catch (error) {
      console.error('Signup Error:', error);
      res.status(400).json({
        success: false,
        error: error.message,
        code: error.code
      });
    }
  }
);

// ROUTE 2: Authenticating the user using Supabase: POST "/api/auth/login"
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return res.status(400).json({ success: false, error: error.message });
      }

      res.json({ 
        success: true, 
        token: data.session.access_token,
        user: data.user
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, error: "An Error Occurred" });
    }
  }
);

// ROUTE 3: Get the details of the logged-in user using Supabase: POST "/api/auth/getuser"
router.post("/getuser", async (req, res) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  try {
    const { data, error } = await supabase.auth.getUser(token);

    if (error) {
      return res.status(401).json({ success: false, error: error.message });
    }

    // Get additional user details from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return res.status(400).json({ success: false, error: profileError.message });
    }

    res.json({ 
      success: true,
      user: {
        ...data.user,
        ...profile
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: "An Error Occurred" });
  }
});

module.exports = router;*/}