const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const Styliner = require("styliner");
const ejs = require("ejs");

const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: "alexdeneve@hotmail.be",
    pass: "Q.E$&uZK5dHtk",
  },
});

const pickUpOrder = async (receiver, subject, data, farmAddresses) => {
  try {
    let totalPrice = 0;
    const produits = {
      produits: data,
      totalPrice: totalPrice,
      farmAddresses: farmAddresses,
    };
    produits.produits.forEach((produit) => {
      if (produit.price && produit.quantity) {
        totalPrice += produit.price * produit.quantity;
      }
    });
    produits.totalPrice = totalPrice;

    const templatePath = path.join(__dirname, "pickUpOrder.ejs");
    const ejsTemplate = fs.readFileSync(templatePath, "utf-8");
    const renderedHtml = ejs.render(ejsTemplate, produits);

    const styliner = new Styliner(templatePath, {
      /* options */
    });
    const inlinedHtml = await styliner.processHTML(renderedHtml);

    const mailOptions = {
      from: "alexdeneve@hotmail.be",
      to: receiver,
      subject: subject,
      html: inlinedHtml,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const DeliveryOrder = async (receiver, subject, data, address) => {
  try {
    let totalPrice = 0;
    const produits = {
      produits: data,
      totalPrice: totalPrice,
      address: address,
    };
    produits.produits.forEach((produit) => {
      if (produit.price && produit.quantity) {
        totalPrice += produit.price * produit.quantity;
      }
    });
    produits.totalPrice = totalPrice;

    const templatePath = path.join(__dirname, "deliveryOrder.ejs");
    const ejsTemplate = fs.readFileSync(templatePath, "utf-8");
    const renderedHtml = ejs.render(ejsTemplate, produits);

    const styliner = new Styliner(templatePath, {});
    const inlinedHtml = await styliner.processHTML(renderedHtml);

    const mailOptions = {
      from: "alexdeneve@hotmail.be",
      to: receiver,
      subject: subject,
      html: inlinedHtml,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const notifyFarmer = async (owner, subject, orderId) => {
  try {
    const templatePath = path.join(__dirname, "notifyFarmer.ejs");
    const ejsTemplate = fs.readFileSync(templatePath, "utf-8");
    const renderedHtml = ejs.render(ejsTemplate, { orderId: orderId });

    const styliner = new Styliner(templatePath, {});
    const inlinedHtml = await styliner.processHTML(renderedHtml);

    const mailOptions = {
      from: "alexdeneve@hotmail.be",
      to: owner,
      subject: subject,
      html: inlinedHtml,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  pickUpOrder,
  DeliveryOrder,
  notifyFarmer,
};
