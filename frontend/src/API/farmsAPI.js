import axios from "axios";

export const getFarmsByLocation = async (location) => {
  try {
    const server = import.meta.env.VITE_SERVER_ADDRESS;
    const response = await axios.get(`${server}/farms?search=${location}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error);
  }
};

export const getFarmDetailsAndProducts = async (id) => {
  try {
    const server = import.meta.env.VITE_SERVER_ADDRESS;
    const response = await axios.get(`${server}/farms/getFarm?id=${id}`);
    return response.data;
  } catch (error) {
    console.log("Erreur lors de la récupération des données: ", error);
  }
};

export const getAllFarms = async () => {
  try {
    const server = import.meta.env.VITE_SERVER_ADDRESS;
    const response = await axios.get(`${server}/farms/getAllFarms`);
    return response.data;
  } catch (error) {
    console.log("Erreur lors de la récupération des données: ", error);
  }
};

export const switchStatus = async (id, value) => {
  try {
    const server = import.meta.env.VITE_SERVER_ADDRESS;
    await axios.put(`${server}/farms/switchStatut?id=${id}&value=${value}`);
  } catch (error) {
    console.log("Erreur lors de la récupération des données : ", error);
  }
};

export const hasFarm = async (address) => {
  try {
    const server = import.meta.env.VITE_SERVER_ADDRESS;
    const response = await axios.get(
      `${server}/farms/hasFarm?address=${address}`
    );
    return response;
  } catch (error) {
    console.log("Erreur lors de la récupération des données: ", error);
  }
};

export const updateFarmData = async (data) => {
  try {
    const server = import.meta.env.VITE_SERVER_ADDRESS;
    const response = await axios.post(`${server}/farms/updateFarm`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Réponse du serveur :", response.data);
  } catch (error) {
    console.log("Erreur lors de l'envoi des données : ", error);
  }
};
export const getAllProducts = async (id) => {
  try {
    const server = import.meta.env.VITE_SERVER_ADDRESS;
    const response = await axios.get(`${server}/farms/getProducts?id=${id}`);
    return response;
  } catch (error) {
    console.log("Une erreur est survenue : ", error);
  }
};

export const addProduct = async (data) => {
  try {
    const server = import.meta.env.VITE_SERVER_ADDRESS;
    const response = await axios.post(`${server}/farms/addProduct`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Réponse du serveur :", response.data);
  } catch (error) {
    console.log("Erreur lors de l'envoi des données : ", error);
  }
};
export const getFarmAddress = async (data) => {
  const server = import.meta.env.VITE_SERVER_ADDRESS;

  const uniqueFarmIds = new Set();
  data.forEach((item) => {
    if (item && item.farmId) {
      uniqueFarmIds.add(item.farmId);
    }
  });
  const uniqueFarmIdsArray = Array.from(uniqueFarmIds);

  try {
    const response = await axios.post(`${server}/farms/getAddress`, {
      farmIds: uniqueFarmIdsArray,
    });

    return response.data; // Vous pouvez renvoyer les données nécessaires depuis la réponse du serveur
  } catch (error) {
    console.error("Erreur lors de la requête au backend :", error);
    throw error; // Vous pouvez gérer l'erreur comme approprié pour votre application
  }
};

export const canDelivery = async (address, farm) => {
  try {
    const server = import.meta.env.VITE_SERVER_ADDRESS;
    const requestData = {
      address: address,
      farm: farm,
    };

    const response = await axios.post(
      `${server}/farms/canDelivery`,
      requestData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Erreur lors de l'envoi des données : ", error);
  }
};

export const payement = async (body) => {
  try {
    const server = import.meta.env.VITE_SERVER_ADDRESS;

    const response = await axios.post(
      `${server}/farms/create-checkout-session`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Erreur lors de l'envoi des données : ", error);
  }
};

export const cancelPayement = async (stripeId) => {
  try {
    const server = import.meta.env.VITE_SERVER_ADDRESS;
    await axios.post(`${server}/farms/cancelPayement`, stripeId);
  } catch (error) {
    console.log("Erreur lors de l'envoi des données : ", error);
    throw error;
  }
};
export const successPayement = async (body) => {
  try {
    const server = import.meta.env.VITE_SERVER_ADDRESS;
    await axios.post(`${server}/farms/successPayement`, body);
  } catch (error) {
    console.log("Erreur lors de l'envoi des données : ", error);
    throw error;
  }
};
export const getFarmOrder = async (farmId) => {
  try {
    const server = import.meta.env.VITE_SERVER_ADDRESS;
    const response = await axios.post(`${server}/farms/getFarmOrders`, {
      farmId: farmId,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const getOrderDetailsForFarm = async (orderId, farmId) => {
  try {
    const server = import.meta.env.VITE_SERVER_ADDRESS;
    const response = await axios.post(`${server}/farms/getFarmOrderDetails`, {
      farmId: farmId,
      orderId: orderId,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const confirmFarmOrder = async (orderId, products) => {
  try {
    const server = import.meta.env.VITE_SERVER_ADDRESS;
    await axios.post(`${server}/farms/confirmFarmOrder`, {
      products: products,
      orderId: orderId,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const checkQuantity = async (cart) => {
  try {
    const server = import.meta.env.VITE_SERVER_ADDRESS;
    const response = await axios.post(`${server}/farms/checkQuantity`, {
      cart: cart,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const deleteProduct = async (id) => {
  try {
    const server = import.meta.env.VITE_SERVER_ADDRESS;
    const response = await axios.post(`${server}/farms/deleteProduct`, {
      id: id,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
