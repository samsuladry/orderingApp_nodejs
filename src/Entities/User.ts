import express, { NextFunction, Request, Response} from "express"
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export const getAllUser = async () => {
    try {
        const users = await prisma.user.findMany()

        return users
    }
    catch (error) {
        return null
    }

}

// To get the user from db
export const getUser = async (name: string) =>
{
    try
    {
        const user = await prisma.user.findUnique({ where: { name: name }});
        return user
    }
    catch(error)
    {
        return null
    }
}

export const encryptPassword = async (password: string) =>
{
    const hashedPassword = await bcrypt.hash(password, 10);

    return hashedPassword
}

// to create a new user in the Users table
export const newUser = async (name: string, password: string, balance: number) =>
{
    
    try
    {
        const user = await prisma.user.create({
            data: {
                name: name,
                password: password,
                balance: balance
            }
        })
        return user
    }
    catch(error)
    {
        return null
    }
}
export const updateBalance = async (id: number, balance: number) =>
{
    try
    {
        const user = await prisma.user.update({
            where: { id: id},
            data: {
                balance: balance
            }
        })
        return user
    }
    catch(error)
    {
        return null
    }
}


export const comparePassword = async (userPassword: string, dbPassword: string) =>
{
    const comparedPassword = await bcrypt.compare(userPassword, dbPassword); // return boolean
    return comparedPassword
}


//suppose to decrypt the JWT but
//for the purposes of this assignment, only need to put a string od the
//Authorization header
export const authenticate = (req: Request, res: Response, next: NextFunction) =>
{ 
    const token: any = req.headers['authorization']
    // console.log(token)
    if(token == null || token == "") return res.status(401).json("No Token founded")
    next()

}