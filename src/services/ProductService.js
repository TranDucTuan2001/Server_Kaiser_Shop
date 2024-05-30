const Product = require("../models/ProductModel");

const createProduct = (newProduct) => {
  return new Promise(async (resolve, reject) => {
    const { name, image,image1,image2,image3, type, price, countInStock, rating, description,discount } =
      newProduct;

    try {
      const checkProduct = await Product.findOne({
        name: name,
      });
      if (checkProduct !== null) {
        resolve({
          status: "ERR",
          message: "Tên của sản phẩm đã tồn tại",
        });
      }

      const newProduct = await Product.create({
        name,
        image,
        image1,
        image2,
        image3,
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
          message: "Tên của sản phẩm đã tồn tại",
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
          message: "Sản phẩm không tồn tại",
        });
      }
      await Product.findByIdAndDelete(id);

      resolve({
        status: "OK",
        message: "Xoá sản phẩm thành công",
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
      const query = {};
      const options = {
        skip: page * limit,
        limit: limit,
        sort: { createdAt: -1 } // default sort by newest first
      };

      if (filter) {
        const label = filter[0];
        query[label] = { $regex: new RegExp(filter[1], "i") };
      }

      if (sort) {
        const ObjectSort = {};
        ObjectSort[sort[1]] = sort[0];
        options.sort = ObjectSort;
      }

      allProducts = await Product.find(query, null, options);
      totalProduct = await Product.countDocuments(query);

      const totalPage =
        Math.floor(totalProduct / limit) + (totalProduct % limit !== 0 ? 1 : 0);

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
          message: "Sản phẩm không tồn tại",
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
          message: "Sản phẩm không tồn tại",
        });
      }
      await Product.deleteMany({ _id: ids });

      resolve({
        status: "OK",
        message: "Xoá sản phẩm thành công",
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
