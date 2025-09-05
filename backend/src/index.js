import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';

//load env variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

//mongodb connection
mongoose.connect(process.env.MONGO_URL) 
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("MongoDB error",err));

    //Apollo GraphQl setup
    const typeDefs=`
    type Query{
        hello:String
    }
    `;
     
    const resolvers={
        Query:{
            hello:()=>'Hello world!'
        }
    };

    const server= new ApolloServer({
        typeDefs,
        resolvers
    });

    const startServer=async()=>{
        //start the apollo server
        await server.start();
        //use express middleware to integrate apollo server with express application
        app.use(
            //this is the path for your graphQl endpoint
            '/graphql',
            cors(),
            express.json(),
            expressMiddleware(server)
        );
    }

    //start express server
    const PORT=process.env.PORT || 4000;
    app.listen(PORT,()=>{
        console.log(`Server is ready at http://localhost:${PORT}/graphql`);
    });

    startServer();
