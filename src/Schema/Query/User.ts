import { GraphQLList } from "graphql";
import { getAllUser } from "../../Entities/User";
import { UserType } from "../TypeDef/User";

export const GET_ALL_USER = 
{
    type: new GraphQLList(UserType),
    resolve()
    {
        return getAllUser
    }
}

// export const SIGNUP = 
// {
//     type: UserType,
//     resolve()
//     {
//         return getAllUser
//     }
// }