import { generateToken } from "../config/generateToken.js";
import { publishToQueue } from "../config/rabbitmq.js";
import TryCatch from "../config/TryCatch.js";
import { redisClient } from "../index.js";
import { User } from "../model/User.js";;
import { AuthenticatedRequest } from "../middleware/isAuth.js";


export const loginUser = TryCatch(async (req, res) => {
    const { email, password } = req.body;

    const rateLimitKey = `otp:ratelimit:${email}`;
    const ratelimit = await redisClient.get(rateLimitKey);

    if (ratelimit) {
        return res.status(429).json({ 
            message: 'Too many requests. Please try again later.' 
        });

    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const otpKey = `otp:${email}`;

    await redisClient.set(`otp:${email}`, otp, {
        EX: 300,
    });

    await redisClient.set(rateLimitKey, 'true', {
        EX: 60,
    });

    const message = {
        to: email,
        subject: 'Your OTP Code',
        body: `Your OTP code is ${otp}. It will expire in 5 minutes.`
    }

    await publishToQueue('send-otp', message);

    res.json({ message: 'OTP sent to email' });
});

export const verifyUser = TryCatch(async (req, res) => {
    const { email, otp:enteredOtp } = req.body;

    if (!email || !enteredOtp) {
        return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const otpKey = `otp:${email}`;
    const storedOtp = await redisClient.get(otpKey);

    if (!storedOtp || storedOtp !== enteredOtp) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    await redisClient.del(otpKey);

    let user = await User.findOne({
        email
    });

    if(!user){
        const name = email.slice(0, 8)
        user = await User.create({ email, name });
    }

    const token = generateToken(user);
    
    res.json({ 
        message: 'user verified successfully',
        user,
        token,
     });
});


export const myProfile = TryCatch(async(req: AuthenticatedRequest, res)=>{
    const user = req.user;
    res.json({ user });
});



export const updateName = TryCatch(async(req: AuthenticatedRequest, res)=>{
    const user = await User.findByIdAndUpdate(req.user?._id);

    if(!user){
        return res.status(404).json({ message: 'plss login' });
    }

    user.name = req.body.name;
    await user.save();

    const token = generateToken(user);
    res.json({
        meassage: 'user updated successfully',
        user,
        token,
    });
});


export const getAllUsers = TryCatch(async(req: AuthenticatedRequest, res)=>{
    const users = await User.find();
    res.json({ users });
});


export const getAUser = TryCatch(async(req: AuthenticatedRequest, res)=>{
    const user = await User.findById(req.params.id);

    res.json({ user });
});