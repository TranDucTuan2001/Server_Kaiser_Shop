const express = require("express");
const router = express.Router()
const orderController=require('../controllers/OrderController')
const {authMiddleWare,authUserMiddleWare}=require('../middleware/authMiddleware')

router.post('/create/:id',authUserMiddleWare,orderController.createOrder)
router.get('/get-all-order/:id',authUserMiddleWare,orderController.getAllDetailsOrder)
router.get('/get-details-order/:id&:orderId',authUserMiddleWare,orderController.getDetailsOrder)
router.delete('/cancel-order/:id&:orderId',authUserMiddleWare,orderController.cancelOrder)
router.get('/get-all-orders',authMiddleWare,orderController.getAllOrder)
router.put('/update-order/:id',authUserMiddleWare,orderController.updateOrder)
router.delete('/delete-order/:id',authMiddleWare,orderController.deleteOrder)
router.post('/delete-many',authMiddleWare,orderController.deleteMany)


module.exports=router  