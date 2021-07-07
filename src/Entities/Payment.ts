import { PrismaClient } from '@prisma/client'
import { updateOrderStatus } from './Order'
import { updateBalance } from './User'

const prisma = new PrismaClient()

export const getAllPayment = async () =>
{
    try 
    {
        const payment = prisma.payment.findMany()
        return payment
        
    } catch (error) {
        return null
    }
}

export const getPayment = async (id: string) =>
{
    try 
    {
        const payment = prisma.payment.findUnique(
            {
                where: {
                    id: id
                }
            }
        )
        return payment
        
    } catch (error) {
        return null
    }
}

export const pay = async (userId: number, orderId: string, price: number, quantity: number, balance: number) => 
{
    try 
    {
        const totalPrice = price * quantity
        // if(totalPrice > balance ) throw new Error("Insufficient money, please top up before making the payment")
        

        if(balance > totalPrice)
        {
            const newBalance = balance - totalPrice

            const bal = await updateBalance(userId, newBalance)
            if(bal === null) throw new Error('Balance not update');
            
            const updateOrder = await updateOrderStatus(orderId, "Confirmed")
            if(updateOrder === null) throw new Error('Order not confirmed');

            const payment = prisma.payment.create({
                data:
                {
                    user_id: userId,
                    order_id: orderId,
                    paymentStatus: "Payment Successfull"
                }
            })
            return payment
        }
        else
        {
            const updateOrder = await updateOrderStatus(orderId, "Cancelled orders, insufficient balance")
            if(updateOrder === null) throw new Error('There is an error');

            const payment = prisma.payment.create({
                data:
                {
                    user_id: userId,
                    order_id: orderId,
                    paymentStatus: "Payment Declined"
                }
            })
            return (payment)
        }
        

        
    } catch (error) {
        return error
    }
}