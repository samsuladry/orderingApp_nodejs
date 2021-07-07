import { prisma } from "@prisma/client"
import express, { Request, Response } from "express"
import { createProduct, getAllOrder, getOrder, updateOrderStatus } from "../Entities/Order"
import { authenticate, getAllUser, getUser } from "../Entities/User"

const router = express.Router()

router.get('/', async (req: Request, res: Response) => 
{
   const ord = await getAllOrder()
   if(ord === null) return res.status(401).json("Error occured")

   res.status(200).json(ord)
})

//to check status odrder
//need to put the orderId
router.get('/getOrder/:name/:orderId', authenticate, async (req: Request, res: Response) => 
{
   try 
   {
      const { name, orderId } = req.params

      //get User
      const users: any = await getUser(name)
      if (users == null) return res.status(401).json({error: "No user with that username"});

      //getOrder
      const order: any = await getOrder(orderId)
      if(order === null ) return res.status(401).json("No Order found ")
      if(order.user_id != users.id ) return res.status(401).json("You are not authorized for the detail of this order")

      const filtOrder = {
         orderId: order.id,
         productName: order.prodName,
         price: order.price,
         quantity: order.quantity,
         totalPrice: order.price * order.quantity,
         status: order.status
      }
      res.status(200).json(filtOrder)
   } 
   catch (error) 
   {
      res.status(401).json(error);
   }
})

// create order
router.post('/createOrder', authenticate, async (req: Request, res: Response) =>
{
   try 
   {
      const {name, prodName, price, quantity} = req.body

      //get User
      const users: any = await getUser(name)
      if (users == null) return res.status(401).json({error: "No user with that username"});

      //create product
      const product = await createProduct(users.id, prodName, price, quantity)
      if (product == null) return res.status(401).json({error: "Your order is invalid"});
      
      res.status(500).json(product)

   } 
   catch (error) 
   {
      res.status(401).json(error);
   }
})

// create order
router.post('/confirmOrder', authenticate, async (req: Request, res: Response) =>
{
   try 
   {
      const { name, orderId } = req.body

      //get User
      const users: any = await getUser(name)
      if (users == null) return res.status(401).json("No user with that username");

      //getOrder
      const order: any = await getOrder(orderId)
      if(order === null ) return res.status(401).json("No Order found ")
      if(order.user_id != users.id ) return res.status(401).json("You are not authorized for this payment")
      if(order.status === "Cancelled" ) return res.status(401).json("This order is already cancelled")
      

      await updateOrderStatus(orderId, "Confirmed")
      
      const order1: any = await getOrder(orderId)
      res.status(500).json(order1)

   } 
   catch (error) 
   {
      res.status(401).json(error);
   }
})



// cancelled order
router.post('/cancelOrder', authenticate, async (req: Request, res: Response) =>
{
   try 
   {
      const {name, orderId} = req.body

      //get User
      const users: any = await getUser(name)
      if (users == null) return res.status(401).json({error: "No user with that username"});

      //getOrder
      const order: any = await getOrder(orderId)
      if(order === null ) return res.status(401).json("No Order found ")
      if(order.user_id != users.id ) return res.status(401).json("You are not authorized for this payment")
      if(order.status === "Confirmed" ) return res.status(401).json("This order has already been paid")
      if(order.status === "Delivered" ) return res.status(401).json("This order has already been delivered")
      
      //create product
      const cancelOrder = await updateOrderStatus(orderId, "Cancelled")
      if (cancelOrder == null) return res.status(401).json({error: "Your order is cancelled"});
      
      const newOrder: any = await getOrder(orderId)
      res.status(500).json(newOrder)

   } 
   catch (error) 
   {
      res.status(401).json(error);
   }
})


export default router