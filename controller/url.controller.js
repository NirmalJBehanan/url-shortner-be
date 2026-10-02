import { nanoid } from "nanoid"
import { Url } from "../model/url.model.js"
import { User } from "../model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
import { sendForgetMail, sendRegistrationEmail } from "../services/mail.services.js";

dotenv.config();

export const createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashpassword = await bcrypt.hash(password, 10)
        const verifyemail = await User.findOne({ email })
        if (verifyemail) {
            return res.status(409).json({
                status: false,
                data: "this email is already exist"
            })
        }
        const response = await User.create({
            username,
            email,
            password: hashpassword
        })
        await sendRegistrationEmail(email, username)
        res.status(200).json({
            status: true,
            data: "user registered successfully"
        })
    } catch (error) {
        console.log("REGISTER ERROR:", error);

        return res.status(500).json({
            status: false,
            data: "Something went wrong",
            error: error.message
        });
    }
}




export const login = async (req, res) => {
    try {
        const { username, email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                status: false,
                data: req.body,
                message: "incorrect email or password"
            });
        }

        const verifyPassword = await bcrypt.compare(password, user.password)
        if (!verifyPassword) {
            return res.status(400).json({
                status: false,
                data: req.body,
                message: "incorrect email or password"
            });
        }
        const token = jwt.sign(
            {
                _id: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );


        res.status(200).json({
            status: true,
            message: "login successfull",
            token
        });


    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: false,
            message: "login failed",
            error: error.message
        });
    }

}



export const createUrl = async (req, res) => {
    const user = req.user
    const { url } = req.body
    const shortid = nanoid(6)
    const response = await Url.create(
        {
            originalUrl: url,
            shortCode: shortid,
            userId: user._id
        }
    )
    const shortUrl = `https://url-shortner-be-recj.onrender.com/api/short/${response.shortCode}`

    res.status(200).json({
        status: "success",
        data: shortUrl
    })

}

export const urlHistory = async (req, res) => {

    const user = req.user

    console.log("User ID:", user._id)

    const urls = await Url.find({
        userId: user._id
    })

    console.log("URLs:", urls)

    res.status(200).json({
        status: "success",
        data: urls
    })
}

export const redirect = async (req, res) => {
    try {
        const { shortCode } = req.params
        const response = await Url.findOne(
            {
                shortCode
            }

        )
        res.redirect(response.originalUrl)
        console.log("working correctly");

    } catch (error) {
        console.log(error);

    }
}

export const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        console.log(email);

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                status: false,
                message: "User not found"
            });
        }

        const token = jwt.sign(
            {
                _id: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        await sendForgetMail(user.email, token);

        return res.status(200).json({
            status: true,
            message: "Password reset link sent to your email"
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

export const resetPassword = async (req, res) => {

    try {

        const { token } = req.params
        const { password } = req.body

        const decode = jwt.verify(
            token,
            process.env.JWT_SECRET
        )

        const user = await User.findById(decode._id)

        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            })
        }

        const hashpassword = await bcrypt.hash(password, 10)

        user.password = hashpassword

        await user.save()

        return res.status(200).json({
            status: true,
            message: "Password successfully changed"
        })

    } catch (error) {

        console.log(error)

        return res.status(500).json({
            status: false,
            message: "Invalid or expired reset link"
        })
    }
}


export const verifyTokens = async (req, res) => {
    return res.status(200).json({
        message: "token verified successfully"
    })
}

export const profile = async (req, res) => {
    const { username, email, role } = req.user
    console.log(username, email)
    return res.status(200).json({
        status: true,
        data: {
            username,
            email,
            role
        }
    })

}