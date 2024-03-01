const axios = require("axios");
const farmsModels = require("../models/farmsModels");
const productsModels = require("../models/productsModels");
const ordersModels = require("../models/ordersModels");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const mailer = require("../utils/nodemailer");

async function getCoordinates(location) {
  const countryCode = "BE"; // Code ISO 3166-1 alpha-2 pour la Belgique

  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        location
      )}&countrycodes=${countryCode}`
    );

    if (response.data.length > 0) {
      const { lat, lon } = response.data[0];
      return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
    } else {
      throw new Error("Localité introuvable en Belgique");
    }
  } catch (error) {
    throw new Error("Erreur lors de la récupération des coordonnées");
  }
}

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // Rayon de la Terre en kilomètres
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance.toFixed(2);
}

// Convertir degrés en radians
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function sortFarmsByDistance(farms, location) {
  const sortedFarms = farms
    .map((farm) => {
      const distance = haversine(
        farm.latitude,
        farm.longitude,
        location.latitude,
        location.longitude
      );
      return { ...farm, distance };
    })
    .sort((a, b) => a.distance - b.distance);

  return sortedFarms;
}

const getFarmsByLocation = async (req, res, next) => {
  const location = req.query.search;
  try {
    const farm = await farmsModels.getAllFarmsAvailable();
    getCoordinates(location)
      .then((coordinates) => {
        const sortedFarms = sortFarmsByDistance(farm, coordinates);
        res.status(200).json({ farms: sortedFarms, coords: coordinates });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Erreur interne du serveur" });
      });
  } catch (error) {
    console.error("Erreur lors de la récupération des fermes : ", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

const getFarmById = async (req, res, next) => {
  const id = req.query.id;
  try {
    const farm = await farmsModels.getFarmById(id);
    const farmProduct = await productsModels.getProductsByFarmId(id);
    res.status(200).json({ farmDetails: farm, farmProduct: farmProduct });
  } catch (error) {
    res.status(500).json({ error: "Erreur interne au serveur" });
  }
};

const getAllFarms = async (req, res, next) => {
  try {
    const farms = await farmsModels.getAllFarms();
    res.status(200).json(farms);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erreur interne au serveur" });
  }
};

const switchFarmStatut = async (req, res, next) => {
  try {
    const data = req.query;
    await farmsModels.switchFarmStatut(data.id, data.value);
  } catch (error) {
    res.status(500).json(error);
  }
};

const hasFarm = async (req, res, next) => {
  try {
    const address = req.query.address;
    const response = await farmsModels.hasFarm(address);

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
};
const updateFarm = async (req, res, next) => {
  try {
    const data = req.body;
    await farmsModels.updateFarm(data);
    res.status(200).json({ message: "Mise à jour réussie" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
const getProducts = async (req, res, next) => {
  try {
    const id = req.query.id;
    const response = await farmsModels.getProducts(id);
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
const addProduct = async (req, res, next) => {
  try {
    const productData = req.body;
    const name = productData.name;
    const imageName = productData.farmId + "_" + name.replace(/\s+/g, "_");
    await farmsModels.addProduct(productData, imageName);
  } catch (error) {
    console.log(error);
  }
};
const getAddress = async (req, res, next) => {
  try {
    const farmIds = req.body.farmIds;
    const response = await farmsModels.getAddress(farmIds);
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

const canDelivery = async (req, res, next) => {
  try {
    const clientAddress = req.body.address;
    const farmAddresses = req.body.farm;

    // Obtenir les coordonnées de l'adresse du client
    const clientCoordinates = await getCoordinates(clientAddress);

    // Obtenir les coordonnées de toutes les adresses de ferme en parallèle
    const farmCoordinatesPromises = farmAddresses.map((farm) =>
      getCoordinates(farm.address)
    );
    const farmCoordinates = await Promise.all(farmCoordinatesPromises);

    // Vérifier la distance entre l'adresse du client et chaque adresse de ferme
    const isDeliveryPossible = farmCoordinates.every((farmCoord) => {
      const distance = haversine(
        clientCoordinates.latitude,
        clientCoordinates.longitude,
        farmCoord.latitude,
        farmCoord.longitude
      );
      return distance <= 30; // Vous pouvez ajuster cette valeur selon votre besoin
    });

    res.status(200).json({ canDelivery: isDeliveryPossible });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
const createCheckoutSession = async (req, res, next) => {
  const { products } = req.body;
  const { user } = req.body;
  const { delivery } = req.body;
  let totalPrice = 0;

  const lineItems = products.map((product) => ({
    price_data: {
      currency: "eur",
      product_data: {
        name: product.name,
        images: [product.image],
      },
      unit_amount: Math.round(product.price * 100),
    },
    quantity: product.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card", "paypal"],
    line_items: lineItems,
    mode: "payment",
    success_url: "http://localhost:5173/payement/success",
    cancel_url: "http://localhost:5173/payement/cancel",
  });

  products.map((product) => {
    totalPrice = totalPrice + product.price * product.quantity;
  });

  await farmsModels.createOrder(session.id, totalPrice, user, delivery);

  res.json({ id: session.id });
};

const cancelPayement = async (req, res, next) => {
  try {
    const stripeId = Object.keys(req.body)[0];
    await farmsModels.updateStatusOrder(stripeId, -1);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
const successPayement = async (req, res, next) => {
  try {
    const stripeId = req.body.stripeId;
    const cart = req.body.cart;
    await farmsModels.updateStatusOrder(stripeId, 1);
    const order = await farmsModels.getOrderByStripeId(stripeId);
    await farmsModels.addProductsToDB(cart, order.id);
    const uniqueFarmIds = new Set();
    cart.map((product) => {
      uniqueFarmIds.add(product.farmId);
    });
    const uniqueFarmIdsArray = [...uniqueFarmIds];
    const farmAddresses = await farmsModels.getAddress(uniqueFarmIdsArray);
    if (order.delivery === null) {
      //mailer.pickUpOrder(order.author,"Confirmation de commande",cart,farmAddresses);
    } else {
      mailer.DeliveryOrder(
        order.author,
        "Confirmation de commande",
        cart,
        order.delivery
      );
    }

    for (const farm of farmAddresses) {
      await mailer.notifyFarmer(farm.owner, "Nouvelle commande !", order.id);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
const getFarmOrders = async (req, res) => {
  try {
    farmId = req.body.farmId;
    const allProducts = await farmsModels.getProducts(farmId);
    const productIds = allProducts.map((product) => product.id);
    const orderForFarms = await ordersModels.getOrderByProductId(productIds);
    const uniqueOrders = orderForFarms.reduce((unique, order) => {
      if (!unique.some((item) => item.orderid === order.orderid)) {
        unique.push(order);
      }
      return unique;
    }, []);

    res.status(200).json(uniqueOrders);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
const getFarmOrderDetails = async (req, res) => {
  try {
    farmId = req.body.farmId;
    orderId = req.body.orderId;
    const allProducts = await farmsModels.getProducts(farmId);
    const productIds = allProducts.map((product) => product.id);
    console.log(productIds);
    res.status(200).json(productIds);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
const confirmFarmOrder = async (req, res) => {
  try {
    orderId = req.body.orderId;
    products = req.body.products;
    const isFullValid = await farmsModels.confirmFarmOrder(products, orderId);
    if (isFullValid) {
      ordersModels.setOrderReady(orderId);
      //récupérer les mails de tout les livreurs
      //Envoyer un mail à chaque livreur avec le/les adresse(s) ou il faut aller le paquet et l'adresse de livraison
      //mettre un lien pour accepté la livraison (gérer la partie visuel en front)
      //faire une route côté back pour assigner le livreur à la commande (stripeId + id du livreur)
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
const checkQuantity = async (req, res) => {
  try {
    const cart = req.body.cart;
    let count = 0;
    for (const product of cart) {
      const response = await farmsModels.checkQuantity(
        product.id,
        product.quantity
      );
      if (response) {
        count++;
      }
    }
    if (count === cart.length) {
      for (const product of cart) {
        await farmsModels.removeQuantity(product.id, product.quantity);
      }
      res.status(200).json(true);
    } else {
      res.status(500).json(false);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
const deleteProduct = async (req, res) => {
  try {
    const id = req.body.id;
    await farmsModels.deleteProduct(id);
    res.status(200).json(true);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
module.exports = {
  getFarmsByLocation,
  getFarmById,
  getAllFarms,
  switchFarmStatut,
  hasFarm,
  updateFarm,
  getProducts,
  addProduct,
  getAddress,
  canDelivery,
  createCheckoutSession,
  cancelPayement,
  successPayement,
  getFarmOrders,
  getFarmOrderDetails,
  confirmFarmOrder,
  checkQuantity,
  deleteProduct,
};
