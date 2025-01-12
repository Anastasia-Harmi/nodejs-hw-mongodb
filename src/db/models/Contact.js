import { Schema, model } from "mongoose";
//створюємо схему
const contactSchema = new Schema ({
    name: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    email: String,
isFavourite: {
    type: Boolean,
    default: false,
},
contactType: {
    type: String,
    enum: ["work", "home", "personal"],
    required: true,
    default: "personal"
},
},

{
    timestamps: true,  // автоматичне додавання createdAt та updatedAt
},
);

//Створюємо модель(це клас, тому з великої)
const ContactCollection = model("contact", contactSchema); //аргументи: (назва колекції, схема)
export default ContactCollection;
