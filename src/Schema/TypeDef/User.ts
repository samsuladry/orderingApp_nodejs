import { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt, } from "graphql";


export const UserType = new GraphQLObjectType({
    name: "user",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        password: { type: GraphQLString },
        balance: { type: GraphQLInt }
    })
})
