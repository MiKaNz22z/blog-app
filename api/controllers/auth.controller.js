import User from "../models/user.model.js"
import bcryptjs from "bcryptjs";
import { errorHandle } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    if(!username || !email || !password || username === "" || email === "" || password === "") {
        next(errorHandle(400, "All fields are required"));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({
        username,
        email,
        password: hashedPassword
    });

    try {
        await newUser.save();
        res.json('Signup succesfully');
    } catch(error) {
        next(error);
    }
}

export const signin = async (req, res, next) => {
    const {email, password} = req.body;
    if(!email || !password || email === "" || password === "") {
        next(errorHandle(400, "All fields are required"));
    }

    try {
        const validUser = await User.findOne({ email });
        if(!validUser) {
            return next(errorHandle(404, 'User not found'))
        }
        
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if(!validPassword) {
            return next(errorHandle(400, "Invalid password"))
        }

        const token = jwt.sign({ id: validUser._id, isAdmin: validUser.isAdmin, isAuthor: validUser.isAuthor }, process.env.JWT_SECRET)
        const { password: pass, ...rest } = validUser._doc;
        res.status(200).cookie('access_token', token, {httpOnly: true}).json(rest)
    } catch(error) {
        next(error);
    }
}

export const google = async (req, res, next) => {
    const { email, name, googlePhotoUrl } = req.body;
    try {
        const user = await User.findOne({email});
        if(user) {
           const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin, isAuthor: user.isAuthor }, process.env.JWT_SECRET);
           const { password, ...rest } = user._doc;
           res.status(200).cookie('access_token', token, {
            httpOnly: true,
           }).json(rest);
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = new User({
                username: name.toLowerCase().split('').join('') + Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl,
            });
            await newUser.save();
            const token = jwt.sign({id: newUser._id, isAdmin: newUser.isAdmin, isAuthor: newUser.isAuthor }, process.env.JWT_SECRET);
            const { password, ...rest } = newUser._doc;
            res.status(200).cookie('access_token', token, {
                httpOnly: true,
            }).json(rest);
        }
    } catch (error) {
        next(error);
    }
}