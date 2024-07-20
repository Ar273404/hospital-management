import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/error.js";
import { Appointment } from "../models/appointementSchema.js";
import { User } from "../models/userSchema.js";

export const postAppointment = catchAsyncErrors(async(req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctor_firstName,
    doctor_lastName,
    hasVisited,
    address,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !appointment_date ||
    !department ||
    !doctor_firstName ||
    !doctor_lastName ||
    !address
  ) {
    return next(new ErrorHandler("🙏🙏Please Fill Full Form!", 400));
  }
  const isDocterAvailiable = await User.find({
    firstName:doctor_firstName,
    lastName:doctor_lastName,
    role:"Doctor",
    doctorDepartment:department,
  });
  if(isDocterAvailiable.length === 0)
  {
    return next(new ErrorHandler("🙅🙅Doctor not found", 404));
  }
  if(isDocterAvailiable.length>1)
  {
      new ErrorHandler(
        "🧑‍⚕️🧑‍⚕️Doctors Conflict arises! Please Contact Through Email Or Phone!",
        400
      );
  }
  const doctorId = isDocterAvailiable[0]._id;
  const patientId = req.user._id;
  const appointment = await Appointment.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctor: {
      firstName: doctor_firstName,
      lastName: doctor_lastName,
    },
    hasVisited,
    address,
    doctorId,
    patientId,
  });
  console.log(appointment);
  res.status(200).json({
     success:true,
     appointment,
     message:"👍👍Apointment Send Successfully"
  })
});

export const getAllAppointment = catchAsyncErrors(async(req,res,next)=>{
    let appointment = await Appointment.find();
    res.status(200).json({
        success:true,
        appointment,
    })
})

export const updateAppointmentStatus = catchAsyncErrors(async(req,res,next)=>{
    const {id} = req.params;
    let  appointment = await Appointment.findById(id);
    if(!appointment)
    {
         return next(new ErrorHandler("🙅🙅Appointment not found!", 404));
    }
    appointment = await Appointment.findByIdAndUpdate(id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    });
    res.status(200).json({
      success: true,
      message: "😃😃Appointment Status Updated Successfully!",
    });
});

export const deleteAppointment = catchAsyncErrors(async(req,res,next)=>{
    const {id} = req.params;
    const appointment = await Appointment.findById(id);
    if(!appointment)
    {
        return next(new ErrorHandler("🤭🤭Appointment Not Found!", 404));
    }
    await appointment.deleteOne();
     res.status(200).json({
       success: true,
       message: "😎😎Appointment Deleted!",
     });
})
