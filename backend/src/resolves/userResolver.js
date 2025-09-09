import jwt from 'jsonwebtoken';
import Joi from 'joi';
import User from '../models/User.js';

//Joi schema for input validation

const userSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

export const userResolver = {
  Query: {
    users: async (_,__,{user}) => {
        if (!user) throw new Error("Authentication required");
        try{
            return await User.find();
        }catch (error) {
            throw new Error("Failed to fetch users");
        }
    },
    user:async(__, {id},{user})=>{
        if(!user) throw new Error("Authentication required");
        try{
            const foundUser=await User.findById(id);
            if(!foundUser) throw new Error("User not found");
            return foundUser;
        }catch (error) {
            throw new Error("Failed to fetch user");
        }
    }
  },
  Mutation:{
    createUser:async(_,{input})=>{
        const {error}=userSchema.validate(input);
        if(error) throw new Error(error.details[0].message);
        try{
            const user = new User(input);
            return await user.save();   
        }catch (error) {
            if(error.code===11000){
                throw new Error("Email already exists");
            }
            throw new Error("Failed to create user");
        }
    },
    updateUser:async(__,{id,input},{user})=>{
        if(!user) throw new Error("Authentication required");
        if(user.userId!==id) throw new Error("Not authorized to update this user");
        try{
            const updatedUser=await User.findByIdAndUpdate(id,input,{new:true});
            if(!updatedUser) throw new Error("User not found for update");
            return updatedUser;
        }catch (error) {
            throw new Error("Failed to update user");
        }

  },
    deleteUser:async(__,{id},{user})=>{
        if(!user) throw new Error("Authentication required");
        if(user.userId!==id) throw new Error("Not authorized to delete this user");
        try{
            const deletedUser=await User.findByIdAndDelete(id);
            if(!deletedUser) throw new Error("User not found for deletion");
            return true;
        }catch (error) {
            throw new Error("Failed to delete user");
        }
    },
    login:async(_,{email,password})=>{
        const user =  await User.findOne({email});
        if (!user) throw new Error("Invalid credentials");
        const isMatch = await user.comparePassword(password);
        if (!isMatch) throw new Error("Invalid credentials");
        const token = jwt.sign(
            {userId: user.id, role:user.role},
            process.env.JWT_SECRET,
            {expiresIn: '3d'}
        );
        return {token, user};
    }
}
  
};