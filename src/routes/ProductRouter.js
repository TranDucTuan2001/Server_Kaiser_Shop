const express = require("express");
const router = express.Router()
const productController=require('../controllers/ProductController')
const {authMiddleWare}=require('../middleware/authMiddleware')
router.post('/create',productController.createProduct)
router.put('/update-product/:id',authMiddleWare,productController.updateProduct)
router.delete('/delete-product/:id',authMiddleWare,productController.deleteProduct)
router.get('/get-all',productController.getAllProduct)
router.get('/get-details/:id',productController.getDetailsProduct)
router.post('/delete-many',authMiddleWare,productController.deleteMany)
router.get('/get-all-type',productController.getAllType)



module.exports=router  