const Order = require("../models/OrderProduct");
const Product = require("../models/ProductModel");
const EmailService = require("../services/EmailService");
const createOrder = (newOrder) => {
  return new Promise(async (resolve, reject) => {
    const {
      orderItems,
      paymentMethod,
      delivery,
      itemsPrice,
      shippingPrice,
      totalPrice,
      fullName,
      address,
      city,
      phone,
      user,
      isPaid,
      paidAt,
      email,
    } = newOrder;
    try {
      const validOrderItems = [];
      const insufficientProducts = [];

      for (const order of orderItems) {
        const productData = await Product.findOneAndUpdate(
          {
            _id: order.product,
            countInStock: { $gte: order.amount },
          },
          {
            $inc: {
              countInStock: -order.amount,
              selled: +order.amount,
            },
          },
          { new: true }
        );

        if (productData) {
          validOrderItems.push(order);
        } else {
          const productName = (await Product.findById(order.product)).name;
          insufficientProducts.push(productName);
        }
      }

      if (insufficientProducts.length > 0) {
        return resolve({
          status: "ERR",
          message: `Sản phẩm: [${insufficientProducts.join(
            ", "
          )}] không đủ hàng !`,
        });
      }

      const newOrder = await Order.create({
        orderItems: validOrderItems,
        shippingAddress: {
          fullName,
          address,
          city,
          phone,
        },
        paymentMethod,
        delivery,
        itemsPrice,
        shippingPrice,
        totalPrice,
        user: user,
        isPaid,
        paidAt,
      });

      await EmailService.sendEmailCreateOrder(email, orderItems, newOrder);

      resolve({
        status: "OK",
        message: "Đặt hàng thành công !",
        data: newOrder,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllDetailsOrder = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.find({
        user: id,
      }).sort({ createdAt: -1 });
      if (order === null) {
        resolve({
          status: "ERR",
          message: "Đơn hàng không tồn tại",
        });
      }
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: order,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailsOrder = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.findById({
        _id: id,
      });
      if (order === null) {
        resolve({
          status: "ERR",
          message: "Đơn hàng không tồn tại",
        });
      }
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: order,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const cancelOrder = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const validOrderItems = [];
      const insufficientProducts = [];

      for (const order of data) {
        const productData = await Product.findOneAndUpdate(
          {
            _id: order.product,
            // countInStock: { $gte: order.amount },
          },
          {
            $inc: {
              countInStock: +order.amount,
              selled: -order.amount,
            },
          },
          { new: true }
        );

        if (productData) {
          validOrderItems.push(order);
        } else {
          const productName = (await Product.findById(order.product)).name;
          insufficientProducts.push(productName);
        }
      }

      if (insufficientProducts.length > 0) {
        return resolve({
          status: "ERR",
          message: `Sản phẩm: [${insufficientProducts.join(", ")}] tồn tại!`,
        });
      }

      const order = await Order.findByIdAndDelete({
        _id: id,
      });
      if (order === null) {
        resolve({
          status: "ERR",
          message: "Đơn hàng không tồn tại",
        });
      }
      resolve({
        status: "OK",
        message: "Huỷ đơn hàng thành công!",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllOrder = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allOrder = await Order.find().sort({ createdAt: -1 });;
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: allOrder,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateOrder = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkOrder = await Order.findOne({ _id: id });
      if (checkOrder === null) {
        resolve({
          status: "OK",
          message: "Đơn hàng không tồn tại",
        });
        return; 
      }
      const updateOrder = await Order.findByIdAndUpdate(id, data, { new: true });

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: updateOrder,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteOrder = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkOrder = await Order.findOne({ _id: id });
  
      if (checkOrder === null) {
        resolve({
          status: "OK",
          message: "Đơn hàng không tồn tại",
        });
      }
      await Order.findByIdAndDelete(id);

      resolve({
        status: "OK",
        message: "Xoá đơn hàng thành công",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteManyOrder = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkOrder = await Order.find({ _id: ids });

      if (checkOrder === null) {
        resolve({
          status: "ERR",
          message: "Đơn hàng không tồn tại",
        });
      }
      await Order.deleteMany({ _id: ids });

      resolve({
        status: "OK",
        message: "Xoá đơn hàng thành công",
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createOrder,
  getAllDetailsOrder,
  getDetailsOrder,
  cancelOrder,
  getAllOrder,
  updateOrder,
  deleteOrder,
  deleteManyOrder
};
