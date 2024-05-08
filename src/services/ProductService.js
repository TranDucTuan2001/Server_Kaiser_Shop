const Product = require("../models/ProductModel");

const createProduct = (newProduct) => {
  return new Promise(async (resolve, reject) => {
    const { name, image, type, price, countInStock, rating, description,discount } =
      newProduct;

    try {
      const checkProduct = await Product.findOne({
        name: name,
      });
      if (checkProduct !== null) {
        resolve({
          status: "ERR",
          message: "The name of product is already",
        });
      }

      const newProduct = await Product.create({
        name,
        image,
        type,
        price,
        countInStock,
        rating,
        description,
        discount
      });
      if (newProduct) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: newProduct,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
const updateProduct = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { name } = data;

      // Kiểm tra xem có sản phẩm khác có cùng tên không
      const checkProduct = await Product.findOne({ name: name, _id: { $ne: id } });
      if (checkProduct !== null) {
        resolve({
          status: "ERR",
          message: "The name of product is already used by another product",
        });
        return;
      }

      // Nếu không có sản phẩm khác có cùng tên, tiến hành cập nhật sản phẩm
      const updateProduct = await Product.findByIdAndUpdate(id, data, { new: true });

      if (updateProduct) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: updateProduct,
        });
      } else {
        resolve({
          status: "ERR",
          message: "Failed to update product",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
const deleteProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({ _id: id });
   

      if (checkProduct === null) {
        resolve({
          status: "ERR",
          message: "The Product is not already",
        });
      }
      await Product.findByIdAndDelete(id);

      resolve({
        status: "OK",
        message: "Delete Product succsess",
      });
    } catch (e) {
      reject(e);
    }
  });
};
const getAllProduct = (limit, page, sort, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      let totalProduct;
      let allProducts;

      if (filter) {
        const label = filter[0];
        allProducts = await Product.find({
          [label]: { $regex: new RegExp(filter[1], "i") },
        }).skip(page * limit).limit(limit);

        totalProduct = await Product.countDocuments({
          [label]: { $regex: new RegExp(filter[1], "i") },
        });
      } else if (sort) {
        const ObjectSort = {};
        ObjectSort[sort[1]] = sort[0];

        allProducts = await Product.find().skip(page * limit).limit(limit).sort(ObjectSort);
        totalProduct = await Product.countDocuments();
      } else {
        allProducts = await Product.find().skip(page * limit).limit(limit);
        totalProduct = await Product.countDocuments();
      }

      const totalPage = Math.floor(totalProduct / limit) + (totalProduct % limit !== 0 ? 1 : 0);
      
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: allProducts,
        total: totalProduct,
        pageCurrent: Number(page + 1),
        totalPage: totalPage,
      });
    } catch (e) {
      reject(e);
    }
  });
};


const getDetailsProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findById(id);
      if (product === null) {
        resolve({
          status: "ERR",
          message: "The product is not already",
        });
      }
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: product,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteManyProduct = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.find({ _id: ids });
  

      if (checkProduct === null) {
        resolve({
          status: "ERR",
          message: "The Products are not already",
        });
      }
      await Product.deleteMany({ _id: ids });

      resolve({
        status: "OK",
        message: "Delete Products success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllTypeProduct = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allType = await Product.distinct('type');
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: allType,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProduct,
  getDetailsProduct,
  deleteManyProduct,
  getAllTypeProduct
};
