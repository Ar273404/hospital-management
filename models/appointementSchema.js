import mongoose from "mongoose";
import validator from "validator";

const appointmentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "🤪🤪First Name Is Required!"],
    minLength: [3, "👌👌First Name Must Contain At Least 3 Characters!"],
  },
  lastName: {
    type: String,
    required: [true, "🤪🤪Last Name Is Required!"],
    minLength: [2, "✌️✌️Last Name Must Contain At Least 2 Characters!"],
  },
  email: {
    type: String,
    required: [true, "😡😡Email Is Required!"],
    validate: [validator.isEmail, "😡😡Provide A Valid Email!"],
  },
  phone: {
    type: String,
    required: [true, "🤪🤪Phone Is Required!"],
    minLength: [10, "🤪🤪Phone Number Must Contain Exact 10 Digits!"],
    maxLength: [11, "🤪🤪Phone Number Must Contain Exact 11 Digits!"],
  },
  nic: {
    type: String,
    required: [true, "😡😡NIC Is Required!"],
    minLength: [13, "🤪🤪NIC Must Contain Only 13 Digits!"],
    maxLength: [13, "🤪🤪NIC Must Contain Only 13 Digits!"],
  },
  dob: {
    type: Date,
    required: [true, "😡😡DOB Is Required!"],
  },
  gender: {
    type: String,
    required: [true, "👩👪Gender Is Required!"],
    enum: ["Male", "Female"],
  },
  appointment_date: {
    type: String,
    required: [true, "📅📅Appointment Date Is Required!"],
  },
  department: {
    type: String,
    required: [true, "🏬🏬Department Name Is Required!"],
  },
  doctor: {
    firstName: {
      type: String,
      required: [true, "🤪🤪Doctor Name Is Required!"],
    },
    lastName: {
      type: String,
      required: [true, "🤪🤪Doctor LastName Is Required!"],
    },
  },
  hasVisited: {
    type: Boolean,
    default: false,
  },
  address: {
    type: String,
    required: [true, "🤪🤪Address Is Required!"],
  },
  doctorId: {
    type: mongoose.Schema.ObjectId,
    required: [true, "😡😡Doctor Id Is Invalid!"],
  },
  patientId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "🤪🤪Patient Id Is Required!"],
  },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
    default: "Pending",
  },
});

export const Appointment = mongoose.model("Appointment", appointmentSchema);
