import express, { Request, Response } from "express"
import { authenticate, encryptPassword, getAllUser, getUser, newUser, updateBalance } from "../Entities/User"
import bcrypt from 'bcrypt'


const router = express.Router()

router.get('/', async (req: Request, res: Response) => 
{
   try 
   {
       const users = await getAllUser()
       res.status(200).json(users)
   } 
   catch (error) 
   {
       res.status(500).json(error)
   }
   
})

router.post('/signUp', async (req: Request, res: Response) =>
{

    try 
    {
        const { name, password, balance } = req.body


        // // encrypte password
        const hashedPassword = await encryptPassword(password)
        

        // insert new user
        const createNewUser = await newUser(name, hashedPassword, balance)
        if(createNewUser == null) return res.status(401).json("Error signup")

        const user = await getUser(name)
        return res.status(200).json(user)

    } 
    catch (error) 
    {

        res.status(400).json(error)
    }
})

router.post("/login", async (req: Request, res: Response) =>
{
    try 
    {
        const { name, password } = req.body

        //get User
        const users: any = await getUser(name)
        if (users == null) return res.status(401).json({error: "No user with that username"});

        //PASSWORD CHECK
        const validPassword = await bcrypt.compare(password, users.password);
        if (validPassword == null) return res.status(401).json({error: "Incorrect password"});
        
        res.status(200).json(users);

    } 
    catch (error) 
    {
        res.status(401).json(error);
        
    }
})

router.post('/topupBalance', authenticate, async (req: Request, res: Response) =>
{

    try 
    {
        const { name, amount } = req.body

        //get User
        const users: any = await getUser(name)
        if (users == null) return res.status(401).json("No user with that username");

        const total = users.balance + amount

        //update balance
        const bal = await updateBalance(users.id, total)
        if(bal === null) throw new Error('Balance not update');

        const userNew: any = await getUser(name)

        return res.status(200).json(userNew)

    } 
    catch (error) 
    {

        res.status(400).json(error)
    }
})


export default router