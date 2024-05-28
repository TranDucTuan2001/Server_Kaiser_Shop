const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService");

const createUser = (newUser) => {
  return new Promise(async (resolve, reject) => {
    const { name, email, password, phone } = newUser;

    try {
      const checkEmail = await User.findOne({
        email: email,
      });
      if (checkEmail !== null) {
        resolve({
          status: "ERR",
          message: "Email đã tồn tại",
        });
      }
      const hash = bcrypt.hashSync(password, 10);
      const createUser = await User.create({
        name,
        email,
        password: hash,
        phone,
      });
      if (createUser) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          date: createUser,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
const loginUser = (userLogin) => {
  return new Promise(async (resolve, reject) => {
    const { email, password } = userLogin;

    try {
      const checkUser = await User.findOne({
        email: email,
      });
      if (checkUser === null) {
        resolve({
          status: "ERR",
          message: "Người dùng không tồn tại",
        });
      }
      const comparePassword = bcrypt.compareSync(password, checkUser.password);

      if (!comparePassword) {
        resolve({
          status: "ERR",
          message: "Tài khoản hoặc mật khẩu không đúng",
        });
      }
      const access_token = await genneralAccessToken({
        id: checkUser.id,
        isAdmin: checkUser.isAdmin,
      });
      const refresh_token = await genneralRefreshToken({
        id: checkUser.id,
        isAdmin: checkUser.isAdmin,
      });
      resolve({
        status: "OK",
        message: "SUCCESS",
        access_token,
        refresh_token,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const updateUser = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({ _id: id });

      if (checkUser === null) {
        resolve({
          status: "OK",
          message: "Người dùng không tồn tại",
        });
        return;
      }
      if (data.password) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        data.password = hashedPassword;
      }
      const updateUser = await User.findByIdAndUpdate(id, data, { new: true });

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: updateUser,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateUserPassword = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({ _id: id });

      if (checkUser === null) {
        resolve({
          status: "OK",
          message: "Người dùng không tồn tại",
        });
        return;
      }

      const comparePassword = await bcrypt.compare(
        data.password,
        checkUser.password
      );

      if (!comparePassword) {
        resolve({
          status: "ERR",
          message: "Mật khẩu hiện tại không đúng",
        });
        return;
      }

      if (data.newPassword !== data.confirmPassword) {
        resolve({
          status: "ERR",
          message: "Mật khẩu xác nhận lại không đúng",
        });
        return;
      }

      if (data.newPassword) {
        const hashedPassword = await bcrypt.hash(data.newPassword, 10);
        data.password = hashedPassword;
      }

      const updateUser = await User.findByIdAndUpdate(
        id,
        { password: data.password },
        { new: true }
      );

      resolve({
        status: "OK",
        message: "Đổi mật khẩu thành công",
        data: updateUser,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({ _id: id });

      if (checkUser === null) {
        resolve({
          status: "OK",
          message: "Người dùng không tồn tại",
        });
      }
      await User.findByIdAndDelete(id);

      resolve({
        status: "OK",
        message: "Xoá người dùng thành công",
      });
    } catch (e) {
      reject(e);
    }
  });
};
const getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allUser = await User.find();
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: allUser,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const getDetailsUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(id);
      if (user === null) {
        resolve({
          status: "OK",
          message: "Người dùng không tồn tại",
        });
      }
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: user,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteManyUser = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.find({ _id: ids });

      if (checkUser === null) {
        resolve({
          status: "ERR",
          message: "Người dùng không tồn tại",
        });
      }
      await User.deleteMany({ _id: ids });

      resolve({
        status: "OK",
        message: "Xoá người dùng thành công",
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
  getDetailsUser,
  deleteManyUser,
  updateUserPassword,
};
