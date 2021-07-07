import express, { Request, Response } from "express"
import { getOrder, updateOrderStatus } from "../Entities/Order"
import { getAllPayment, getPayment, pay } from "../Entities/Payment"
import { authenticate, getUser } from "../Entities/User"

const router = express.Router()

router.get('/', async (req: Request, res: Response) => 
{
   const payment = await getAllPayment()
   if(payment === null) return res.status(401).json("Error occured")

   res.status(200).json(payment)
})

router.get('/getPaymentDetails/:id', async (req: Request, res: Response) => 
{
   try 
   {
     const paymentId: any = req.params.id
     const paymentDetail = await getPayment(paymentId)
     if(paymentDetail === null ) return res.status(401).json("No Payment Details")

     const filtPay = {
       PaymentID: paymentDetail.id,
       Status: paymentDetail.paymentStatus
     }

     res.status(200).json(filtPay)
   } 
   catch (error) 
   {
    res.status(401).json(error);
   }
})

router.post('/makePayment', authenticate, async (req: Request, res: Response) =>
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
      if(order.status != "Confirmed" ) return res.status(401).json("This order is not confirmed yet")
      // if(order.status === "Delivered" ) return res.status(401).json("This order has already been delivered")

      
      const paid: any= await pay(users.id, orderId, order.price, order.quantity, users.balance)
      if(paid.status === "Payment Declined") return res.status(401).json("Your payment is declined, please check your balance and top up")
      

      await updateOrderStatus(orderId, "Delivered")
      //wait 5 second before change the status to delivered
      setTimeout(async function()
      {
        //getOrder
        const order: any = await getOrder(orderId)
        if(order === null ) return res.status(401).json("No Order found ")
        // if(order.user_id != users.id ) return res.status(401).json("You are not authorized for the detail of this order")

        const filtOrder = {
          orderId: order.id,
          productName: order.prodName,
          price: order.price,
          quantity: order.quantity,
          totalPrice: order.price * order.quantity,
          status: order.status
        }
        res.status(200).json(filtOrder)

      }, 5000);
      
    } 
    catch (error) 
    {
      res.status(401).json(error);
    }
})


export default router