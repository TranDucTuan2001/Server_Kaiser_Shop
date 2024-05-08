const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();
const sendEmailCreateOrder = async (email, orderItems, newOrder) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.MAIL_ACCOUNT,
      pass: process.env.MAIL_PASSWORD,
    },
  });


  // async..await is not allowed in global scope, must use a wrapper
  let totalPrice = 0;
  let listItem = "";
  const attachImage=[]
  orderItems.forEach((order) => {
    totalPrice += (order?.price - (order?.price * order?.discount) / 100) * order?.amount;
    listItem += `
    <div>
        <div>
        Quý khách đã đặt sản phẩm: <b>${order?.name}</b> bên dưới với số lượng: <b>${order.amount}</b> và giá là <b>${(order?.price - (order?.price * order?.discount) / 100) * order?.amount} VND</b>
        </div>
    </div>
    `
    attachImage.push({path:order?.image});
  });
 
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `Kaiser Shop Offical <${process.env.MAIL_ACCOUNT}>` , // sender address
    to: email, // list of receivers
    subject: "Quý khách đã đặt hàng tại Kaiser Shop ✔", // Subject line
    text: "Kaiser Shop", // plain text body
    html: `<div>Kính chào Quý khách <b>${email}</b>,</div>
    <div>Quý khách nhận được email này, vì đã tiến hành giao dịch mua hàng thành công trên trang web <b>Kaiser Shop</b></div>
    <br>
    <div><b>Quý khách đã đặt hàng thành công tại Kaiser Shop</b></div>${listItem}
    <div>Phương thức giao hàng: <b>${newOrder?.delivery.toUpperCase()} Giao hàng tiết kiệm</b></div>
    <div>Phí giao hàng: <b>${newOrder?.shippingPrice} VND</b></div>
    <div><b>Tổng tiền là: ${newOrder?.totalPrice} VND</b></div>
    <br>
    <div>Dưới đây là thông tin giao hàng mà quý khách đã cung cấp:</div>
    <ul>
    <li>Tên: <b>${newOrder?.shippingAddress?.fullName}</b></li>
    <li>Địa chỉ: <b>${newOrder?.shippingAddress?.address} - ${newOrder?.shippingAddress?.city}</b></li>
    <li>Số điện thoại: <b>${newOrder?.shippingAddress?.phone}</b></li>
    </ul>`,
    attachments:attachImage
  });
};

module.exports = {
  sendEmailCreateOrder,
};
