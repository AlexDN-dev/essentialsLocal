import React, { useState, useEffect } from "react";
import "../../Styles/views/farmParams.css";
import { CustomButton } from "../CustomButton";
import { updateFarmData } from "../../API/farmsAPI";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const GlobalParams = ({ data }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    desc: "",
    schedule: "",
    image: null,
  });

  useEffect(() => {
    setFormData({
      name: data.name,
      phoneNumber: data.phoneNumber,
      desc: data.desc,
      schedule: data.schedule,
      image: null,
    });
  }, [data]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setFormData({ ...formData, image: file });
  };

  const handleModifyClick = async (e) => {
    e.preventDefault();

    const farms = new FormData();
    farms.append("id", data.id);
    farms.append("name", formData.name);
    farms.append("phoneNumber", formData.phoneNumber);
    farms.append("desc", formData.desc);
    farms.append("schedule", formData.schedule);

    if (selectedFile) {
      farms.append("image", selectedFile);
    }
    try {
      await updateFarmData(farms);
      toast.success("Les données ont été mises à jour avec succès.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    } catch (error) {
      console.log("Erreur lors de l'envoi des données : ", error);
      toast.error("Une erreur s'est produite. Veuillez réessayer.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    }
  };

  return (
    <form
      className="globalParams"
      onSubmit={handleModifyClick}
      encType="multipart/form-data"
    >
      <ToastContainer />
      <div className="globalParamsContainer">
        <h3>Nom</h3>
        <input
          type="text"
          name="name"
          placeholder="Nom de la ferme"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <h3>Numéro de téléphone</h3>
        <input
          type="text"
          name="phoneNumber"
          placeholder="Numéro de téléphone"
          value={formData.phoneNumber}
          onChange={(e) =>
            setFormData({ ...formData, phoneNumber: e.target.value })
          }
          required
        />
        <div>
          <h3>Description</h3>
          <textarea
            name="desc"
            id="desc"
            placeholder="Description de la ferme"
            value={formData.desc}
            onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
            required
          ></textarea>
        </div>
      </div>
      <div>
        <h3>Horaire</h3>
        <div className="scheduleParams">
          {formData.schedule &&
            formData.schedule.split(",").map((hours, index) => (
              <div key={index}>
                <label>{data[index]}</label>
                <input
                  type="text"
                  value={hours}
                  onChange={(e) => {
                    const newSchedule = [...formData.schedule.split(",")];
                    newSchedule[index] = e.target.value;
                    setFormData({
                      ...formData,
                      schedule: newSchedule.join(","),
                    });
                  }}
                  required
                />
              </div>
            ))}
        </div>
      </div>
      <div className="imageContainer">
        <h3>Image de la ferme</h3>
        <h4>Image actuelle</h4>
        <img
          src={`http://localhost:3000/farms/${data.id}.png`}
          alt="Image de la ferme"
        />
        <div className="imageUpload">
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>
      </div>
      <div className="globalParamsButton">
        <CustomButton text={"Modifier"} type="submit" />
      </div>
    </form>
  );
};
