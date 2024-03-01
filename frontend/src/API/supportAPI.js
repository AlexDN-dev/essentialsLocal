import axios from "axios";

export const sendFarmRequest = async (farmData) => {
  try {
    const server = import.meta.env.VITE_SERVER_ADDRESS;
    await axios.post(`${server}/support/farmRequest`, { farmData });
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error);
    throw error;
  }
};

export const getAllRequestFarm = async () => {
  try {
    const server = import.meta.env.VITE_SERVER_ADDRESS;
    const requestList = await axios.get(`${server}/support/farmRequest`);
    console.log(requestList);
    return requestList.data;
  } catch (error) {
    console.log("Erreur dans la récupération des données : ", error);
    throw error;
  }
};

export const allowFarms = async (data, comment, accept) => {
  try {
    const server = import.meta.env.VITE_SERVER_ADDRESS;
    axios.post(`${server}/support/anwersFarms`, {
      requestData: data,
      comment: comment,
      accept: accept,
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi de la demande:", error);
  }
};

export const addDeliverer = async (deliverer) => {
  try {
    const server = import.meta.env.VITE_SERVER_ADDRESS;
    axios.post(`${server}/support/addDeliverer`, {
      deliverer: deliverer,
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi de la demande:", error);
  }
};
export const gettingDeliverer = async () => {
  try {
    const server = import.meta.env.VITE_SERVER_ADDRESS;
    const response = await axios.post(`${server}/support/getDeliverer`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'envoi de la demande:", error);
  }
};
export const removeDeliverer = async (id) => {
  try {
    const server = import.meta.env.VITE_SERVER_ADDRESS;
    await axios.post(`${server}/support/removeDeliverer`, {
      id: id,
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi de la demande:", error);
  }
};
