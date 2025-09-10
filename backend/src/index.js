import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
//import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { typeDefs,resolvers } from './graphql/schema.js';
import {authMiddleware} from './middleware/auth.js';
import accountRoutes from './routes/accountRoutes.js';

//load env variables
dotenv.config();

const app = express();
//app.use(cors());
app.use(express.json());

 const server= new ApolloServer({
        typeDefs,
        resolvers
    });

    const startServer=async()=>{
        //start the apollo server
        await server.start();
        //use express middleware to integrate apollo server with express application
        //Integrate the account REST API routes
        app.use("/api/accounts",accountRoutes);
        //use middleware to integrate apollo server with express application
        app.use(
            //this is the path for your graphQl endpoint
            '/graphql',
           expressMiddleware(server,{
                context:async({req,res})=>
                    {
                        authMiddleware(req,res,()=>{});
                        return {user:req.user};
                    }
           })
        );
        mongoose.connect(process.env.MONGO_URL) 
    .then(() => {
    console.log("Connected to MongoDB")
    const PORT=process.env.PORT || 4000;
    app.listen(PORT,()=>{
        console.log(`Server is ready at http://localhost:${PORT}/graphql`);
    });
})
.catch(err => console.log("MongoDB error",err));
    }

//mongodb connection


    //start express server
    

    startServer();
