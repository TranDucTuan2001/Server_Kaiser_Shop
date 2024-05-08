const OrderService = require("../services/OrderService");

const createOrder = async (req, res) => {
  try {
    const {
      delivery,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      fullName,
      address,
      city,
      phone,
      isPaid,
      paidAt
    } = req.body;

    if (
      !delivery ||
      !paymentMethod ||
      !itemsPrice ||
      isNaN(shippingPrice) ||
      !totalPrice ||
      !fullName ||
      !address ||
      !city ||
      !phone
    ) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }
   
    const response = await OrderService.createOrder(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllDetailsOrder = async (req, res) => {
  try {
    const userID = req.params.id;

    if (!userID) {
      return res.status(200).json({
        status: "ERR",
        message: "The userID is required",
      });
    }
    const response = await OrderService.getAllDetailsOrder(userID);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getDetailsOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    if (!orderId) {
      return res.status(200).json({
        status: "ERR",
        message: "The orderId is required",
      });
    }
    const response = await OrderService.getDetailsOrder(orderId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const data = req.body;

    if (!orderId) {
      return res.status(200).json({
        status: "ERR",
        message: "The orderId is required",
      });
    }
    const response = await OrderService.cancelOrder(orderId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllOrder = async (req, res) => {
  try {
    const response = await OrderService.getAllOrder();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const updateOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const data = req.body;
    if (!orderId) {
      return res.status(200).json({
        status: "ERR",
        message: "The orderId is required",
      });
    }
    const response = await OrderService.updateOrder(orderId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    if (!orderId) {
      return res.status(200).json({
        status: "ERR",
        message: "The orderId is required",
      });
    }
    const response = await OrderService.deleteOrder(orderId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteMany = async (req, res) => {
  try {
    const ids = req.body.ids;
    if (!ids) {
      return res.status(200).json({
        status: "ERR",
        message: "The ids is required",
      });
    }
    const response = await OrderService.deleteManyOrder(ids);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  createOrder,
  getAllDetailsOrder,
  getDetailsOrder,
  cancelOrder,
  getAllOrder,
  updateOrder,
  deleteOrder,
  deleteMany
};
