import React, { useState, useEffect } from "react";
import { CustomInput } from "./CustomInput";
import { CustomArea } from "./CustomArea";
import { CustomButton } from "./CustomButton";
import { sendFarmRequest } from "../API/supportAPI";
import { showToast, clearToastStorage } from "../utils/ToastUtils";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const FarmForm = () => {
  const [email, setEmail] = useState("");
  const [farmName, setFarmName] = useState("");
  const [address, setAddress] = useState("");
  const [schedule, setSchedule] = useState({
    Monday: "",
    Tuesday: "",
    Wednesday: "",
    Thursday: "",
    Friday: "",
    Saturday: "",
    Sunday: "",
  });
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleScheduleChange = (day, value) => {
    setSchedule((prevSchedule) => ({
      ...prevSchedule,
      [day]: value,
    }));
  };

  const handleSubmit = () => {
    const formData = {
      email,
      farmName,
      address,
      schedule,
      description,
    };

    sendFarmRequest(formData);
    showToast(
      "Votre demande a été soumise avec succès",
      toast.POSITION.TOP_RIGHT
    );
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  return (
    <div className="supportFormContainer">
      <CustomInput
        placeholder={"Adresse mail"}
        onChange={(e) => setEmail(e.target.value)}
      ></CustomInput>
      <CustomInput
        placeholder={"Nom de la ferme"}
        onChange={(e) => setFarmName(e.target.value)}
      ></CustomInput>
      <CustomInput
        placeholder={
          "Adresse postale complète (rue, numéro, code postal et ville)"
        }
        onChange={(e) => setAddress(e.target.value)}
      ></CustomInput>
      <div className="scheduleFarmContainer">
        <div>
          <h3>Horaire de la ferme</h3>
          <p>exemple 8h00 - 17h00 ou fermé</p>
        </div>
        <div>
          <CustomInput
            placeholder={"Lundi"}
            onChange={(e) => handleScheduleChange("Monday", e.target.value)}
          ></CustomInput>
          <CustomInput
            placeholder={"Mardi"}
            onChange={(e) => handleScheduleChange("Tuesday", e.target.value)}
          ></CustomInput>
          <CustomInput
            placeholder={"Mercredi"}
            onChange={(e) => handleScheduleChange("Wednesday", e.target.value)}
          ></CustomInput>
          <CustomInput
            placeholder={"Jeudi"}
            onChange={(e) => handleScheduleChange("Thursday", e.target.value)}
          ></CustomInput>
          <CustomInput
            placeholder={"Vendredi"}
            onChange={(e) => handleScheduleChange("Friday", e.target.value)}
          ></CustomInput>
          <CustomInput
            placeholder={"Samedi"}
            onChange={(e) => handleScheduleChange("Saturday", e.target.value)}
          ></CustomInput>
          <CustomInput
            placeholder={"Dimanche"}
            onChange={(e) => handleScheduleChange("Sunday", e.target.value)}
          ></CustomInput>
        </div>
      </div>
      <CustomArea
        placeholder={
          "Petite description de votre ferme (ceci sera affiché sur la page de cette dernière)"
        }
        onChange={(e) => setDescription(e.target.value)}
      ></CustomArea>
      <CustomButton text={"Envoyer"} onClick={handleSubmit}></CustomButton>
    </div>
  );
};
