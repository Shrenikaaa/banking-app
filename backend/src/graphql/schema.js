import {gql} from "graphql-tag";
import {userTypeDefs} from "./userTypeDefs.js";
import {helloTypeDefs} from "./helloTypeDefs.js";
import { helloResolver } from "../resolves/helloResolver.js";
import { userResolver } from "../resolves/userResolver.js";


const baseTypeDefs = gql`
type Query {
  _empty: String
}
  type Mutation {
  _empty: String
}
`;

export const typeDefs = [baseTypeDefs, userTypeDefs, helloTypeDefs];
export const resolvers = [helloResolver, userResolver];