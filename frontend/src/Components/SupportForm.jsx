import { CustomArea } from "./CustomArea";
import { CustomButton } from "./CustomButton";
import { CustomInput } from "./CustomInput";

export const SupportForm = () => {
  return (
    <div className="supportFormContainer">
      <CustomInput placeholder="Adresse mail"></CustomInput>
      <CustomInput placeholder="Sujet"></CustomInput>
      <CustomArea placeholder="Votre message..."></CustomArea>
      <CustomButton text="Envoyer"></CustomButton>
    </div>
  );
};
