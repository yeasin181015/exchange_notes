const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

dotenv.config();

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({
        where: {
          email,
        },
      });
  
      if (!user) {
        return res
          .send({ message: "User with this email does not exist."})
          .status(404);
      }
  
      const isAuthenticated = await bcrypt.compare(password, user.password);
  
      if (!isAuthenticated) {
        return res
          .send({ message: "Password is incorrect"})
          .status(404);
      }
  
     // ansiduie327484hu4uih32iuehquwrewr7qweyfiuqwehfiuwqe
      const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: Math.floor(Date.now() / 1000) + 60 * 5,
      });

      return res.send({
          "id": user.id,
          "fullname": user.fullname,
          "email": user.email,
          "major": user.major,
          "access_token": accessToken
      })
  

    } catch (err) {
      return res
        .send({
          message: "Something went wrong while logging in. Please try again!",
        })
        .status(500);
    }
  };
  
  exports.signup = async (req, res, next) => {
    const { email, password, fullname, major} = req.body; //req er body r modhe data pathai server ke
  
    const existingUser = await User.findOne({
      where: {
        email,
      },
    });
  
    if (existingUser) {
      return res
        .send({ message: "User with this email is already signed up." })
        .status(406);
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    if (!hashedPassword) {
      return res
        .send("Something went wrong while saving password to database.")
        .status(500); //500 internet sernal server error
    }
  
    const newUser = await User.create({
      email,
      password: hashedPassword,
      fullname,
      major
    });
  
    if (newUser) {
      return res.send({ message: "User created successfully." }).status(200);
    } else {
      return res.send({ message: "User couldn't be created." }).status(400);
    }
  };