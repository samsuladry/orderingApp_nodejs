import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getAllOrder = async () =>
{
    try 
    {
        const order = prisma.order.findMany()
        return order
        
    }
    catch (error) 
    {
        return null
    }
}

export const getOrder = async (order_id: string) =>
{
    try 
    {
        const order = prisma.order.findUnique({
            where:
            {
                id: order_id
            }
        })

        return order
    } 
    catch (error) 
    {
        return null
    }
}

export const updateOrderStatus = async (orderId: string, message: string) =>
{
    try 
    {
        const updateOrder = await prisma.order.update({
            where: { id: orderId },
            data:
            {
                status: message
            }
        })
        return updateOrder
    } 
    catch (error) 
    {
        return null
    }
}

export const createProduct = async (user_id: number, productName: string, price: number, quantity: number) =>
{
    try 
    {
        const product = await prisma.order.create({
            data:
            {
                user_id: user_id,
                prodName: productName,
                price: price,
                quantity: quantity,
                status: "Pending payment"
            }
        })

        return product
    } 
    catch (error) 
    {
        return null
    }
}