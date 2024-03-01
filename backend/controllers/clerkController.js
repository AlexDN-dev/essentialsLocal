const { Clerk } = require("@clerk/clerk-sdk-node");
const axios = require("axios");
const ordersModels = require("../models/ordersModels.js");
const productsModels = require("../models/productsModels.js");

const clerkClient = Clerk({
  secretKey: "sk_test_h1rwazMkyR29U6k5lpQcrZUkqeOLqUqwfV9KVOBDJo",
});

const switchStatut = async (req, res) => {
  try {
    const userId = req.body.target;
    console.log(req.body);
    const banUrl = `https://api.clerk.com/v1/users/${userId}/ban`;
    const unbanUrl = `https://api.clerk.com/v1/users/${userId}/unban`;
    const statut = req.body.actualStatut;

    const headers = {
      Authorization: `Bearer ${process.env.API_CLERK_KEY}`,
    };
    if (statut === false) {
      axios
        .post(banUrl, null, { headers })
        .then((response) => {
          console.log("Utilisateur banni !");
        })
        .catch((error) => {
          console.error(error.response.data);
        });
    }
    if (statut === true) {
      axios
        .post(unbanUrl, null, { headers })
        .then((response) => {
          console.log("Utilisateur débanni !");
        })
        .catch((error) => {
          console.error(error.response.data);
        });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Une erreur s'est produite lors du bannissement." });
  }
};

const getAllUser = async (req, res) => {
  try {
    const organizationId = "org_2YrQPzUBlAY3ybxfzcLP6t141qO";
    const clientList = await clerkClient.users.getUserList();
    const memberships =
      await clerkClient.organizations.getOrganizationMembershipList({
        organizationId,
      });
    res.status(200).json({ users: clientList, admin: memberships });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des utilisateurs" });
  }
};

const isAdmin = async (req, res) => {
  const userId = req.body.userId;
  const organizationId = "org_2YrQPzUBlAY3ybxfzcLP6t141qO";
  const memberships =
    await clerkClient.organizations.getOrganizationMembershipList({
      organizationId,
    });

  const isAdmin = memberships.some((member) => {
    return member.role === "admin" && member.publicUserData.userId === userId;
  });

  if (isAdmin) {
    res.status(200).json(true);
  } else {
    res.status(500).json(false);
  }
};

const getOrders = async (req, res) => {
  const mail = req.body.mail;
  try {
    const order = await ordersModels.getUserOrders(mail);
    res.status(200).json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getOrderDetails = async (req, res) => {
  const orderId = req.body.orderId;
  let productOrder = [];
  try {
    const orderDetails = await ordersModels.getOrderDetails(orderId);
    for (const order of orderDetails) {
      const product = await productsModels.getProductById(order.productid);
      productOrder.push(product.rows[0]);
    }
    const order = await ordersModels.getOrdersByOrderId(orderId);
    res.status(200).json({
      productList: productOrder,
      order: orderDetails,
      orderData: order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = {
  getAllUser,
  switchStatut,
  isAdmin,
  getOrders,
  getOrderDetails,
};
