const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

class AuthController {
    //POST /v1/auth/register
    registerUser = async (req, res) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);

            //Create new user
            const newUser = await new User({
                name: req.body.name,
                username: req.body.username,
                email: req.body.email,
                password: hashed,
                role: req.body.role,
                phone: req.body.phone,
            });

            //Save Database
            const user = await newUser.save();
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json(error);
        }
    };

    //Generate ACCESS_TOKEN
    generateAccessToken = (user) => {
        return jwt.sign(
            {
                id: user._id,
                role: user.role,
                username: user.username,
            },
            process.env.JWT_ACCESS_KEY,
            { expiresIn: "2d" }
        );
    };

    //POST /v1/auth/login
    loginUser = async (req, res) => {
        try {
            const user = await User.findOne({ username: req.body.username });

            if (!user) {
                return res.status(404).json("User not found !");
            }

            const validPassword = await bcrypt.compare(
                req.body.password,
                user.password
            );

            if (!validPassword) {
                return res.status(404).json("Wrong password !");
            }
            if (user && validPassword) {
                const accessToken = this.generateAccessToken(user);

                //Save AccessToken in cookie
                // res.cookie("accessToken", accessToken, {
                //     httpOnly: true,
                //     secure: false,
                //     path: "/",
                //     sameSite: "strict",
                // });

                const { password, ...user_datas } = user._doc; // Remove password to res
                return res.status(200).json({ user_datas, accessToken });
            }
        } catch (error) {
            return res.status(500).json(error);
        }
    };


    // Trigger tạo để gia hạn thời gian sống khi deploy
    trigger = async (req, res) => {
        try {
            res.json({ message: "Hello, World!" });
        } catch (error) {
            res.json({ message: "Error !" });
        }
    };
}

module.exports = new AuthController();
