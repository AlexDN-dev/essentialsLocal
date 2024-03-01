export const saveToLocalStorage = (key, data) => {
  try {
    // Récupérer les données actuelles du localStorage
    const existingDataString = localStorage.getItem(key);
    const existingData = existingDataString
      ? JSON.parse(existingDataString)
      : [];

    // Vérifier s'il existe déjà un objet avec le même id et le même weight
    const indexToRemove = existingData.findIndex(
      (item) => item.id === data.id && item.weight === data.weight
    );

    // Si un tel objet existe, le supprimer du tableau
    if (indexToRemove !== -1) {
      existingData.splice(indexToRemove, 1);
    }

    // Ajouter le nouvel objet au tableau
    existingData.push(data);

    // Enregistrer le tableau mis à jour dans le localStorage
    localStorage.setItem(key, JSON.stringify(existingData));

    console.log("Données mises à jour avec succès dans le localStorage.");
  } catch (error) {
    console.error(
      "Erreur lors de l'enregistrement des données dans le localStorage:",
      error
    );
  }
};
