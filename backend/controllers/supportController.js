const farmsModels = require("../models/farmsModels");
const supportModels = require("../models/supportModels");
const axios = require("axios");

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

const postFarmRequest = async (req, res, next) => {
  try {
    const farmData = req.body.farmData;
    if (farmData.schedule && typeof farmData.schedule === "object") {
      const scheduleString = Object.values(farmData.schedule).join(",");
      await farmsModels.postFarmRequest(farmData, scheduleString);
    } else {
      console.error("farmData.schedule n'est pas un objet valide");
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des produits:", error);
    return res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

const getFarmRequest = async (req, res, next) => {
  try {
    const farmRequest = await farmsModels.getFarmRequest();
    res.status(200).json(farmRequest);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

const anwersFarms = async (req, res, next) => {
  try {
    const farmId = req.body.requestData.id;
    const address = req.body.requestData.address;
    const comment = req.body.comment;
    const awnerValue = req.body.accept;

    await supportModels.addFarmRequest(farmId, awnerValue, comment);
    if (awnerValue === true) {
      getCoordinates(address)
        .then((coordinates) => {
          farmsModels.addFarmCoordonnate(
            farmId,
            coordinates.latitude,
            coordinates.longitude
          );
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ error: "Erreur interne du serveur" });
        });
      await farmsModels.switchFarmStatut(farmId, 1);
    } else if (awnerValue === false) {
      await farmsModels.switchFarmStatut(farmId, -2);
    }
  } catch (error) {}
};
const addDeliverer = async (req, res) => {
  try {
    const deliverer = req.body.deliverer;
    await supportModels.addDeliverer(deliverer);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
const getDeliverer = async (req, res) => {
  try {
    const delivererList = await supportModels.getDeliverer();
    console.log(delivererList.rows);
    res.status(200).json(delivererList.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
const removeDeliverer = async (req, res) => {
  try {
    const id = req.body.id;
    await supportModels.removeDeliverer(id);
    res.status(200).json(true);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = {
  postFarmRequest,
  getFarmRequest,
  anwersFarms,
  addDeliverer,
  getDeliverer,
  removeDeliverer,
};
