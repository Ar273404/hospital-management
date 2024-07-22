import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middleware/error.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";


export const patientRegister = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, nic, dob, gender, password } =
    req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !password
  ) {
    return next(new ErrorHandler("🙏🙏Please Fill All Data!", 400));
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler("User already Registered!", 400));
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "Patient",
  });
  console.log(user);
  generateToken(user, "User Registered!", 200, res);
});



export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, confirmPassword, role } = req.body;
  console.log(req.body);
  if (!email || !password || !confirmPassword || !role) {
    return next(new ErrorHandler("🙏🙏Please Fill Full Form!", 400));
  }
  if (password !== confirmPassword) {
    return next(
      new ErrorHandler("🙅🙅Password & Confirm Password Do Not Match!", 400)
    );
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("🥴🥴Invalid Email Or Password!", 400));
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return next(new ErrorHandler("🥴🥴Invalid Email Or Password!", 400));
  }
    console.log(user);
  if (role != user.role) {
    return next(new ErrorHandler(`🙅🙅User Not Found With This Role!`, 400));
  }
  // console.log(user);
  generateToken(user, "Login Successfully!", 201, res);
});


export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, nic, dob, gender, password } =
    req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !password
  ) {
    return next(new ErrorHandler("🙏🙏Please Fill Full Form!", 400));
  }

  const isRegistered = await User.findOne({ email });
  console.log(isRegistered)
  if (isRegistered) {
    return next(new ErrorHandler(`👩‍🏫👩‍🏫 ${isRegistered.role} With This Email Already Exists!", 400`));
  }

  const admin = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "Admin",
  });
  res.status(200).json({
    success: true,
    message: "New Admin Registered",
    admin,
  });
});



export const addNewDoctor = catchAsyncErrors(async(req,res,next)=>{
    if(!req.files || Object.keys(req.files).length ===0)
    {
       return next(new ErrorHandler("👨‍⚕️👩‍⚕️💉Doctor Avatar Required!", 400));
    }

    const {docAvatar} = req.files;
    const allowedFormates = ["image/png","image/jpeg","image/webp"];
    if(!allowedFormates.includes(docAvatar.mimetype))
    {
       return next(new ErrorHandler("🙏🙏 File format must be png ,jpg/jpeg ,webp"));
    }
   const {
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    doctorDepartment,
  } = req.body;


   if (
     !firstName ||
     !lastName ||
     !email ||
     !phone ||
     !nic ||
     !dob ||
     !gender ||
     !password ||
     !doctorDepartment ||
     !docAvatar
   ) {
     return next(new ErrorHandler("🙏🙏Please Fill All Data!", 400));
   }
   const isRegistered = await User.findOne({email});
   if(isRegistered)
   {
    new ErrorHandler("😔😔Doctor With This Email Already Exists!", 400);
   }

   const cloudinaryResponse = await cloudinary.uploader.upload(
     docAvatar.tempFilePath
   );
   if(!cloudinaryResponse || cloudinaryResponse.error)
   {
    console.error(
        "Cloudinary Error:",
        cloudinaryResponse.error || "Unknown Cloudinary error"
    );
      return next(
        new ErrorHandler("👎👎Failed To Upload Doctor Avatar To Cloudinary", 500)
      );
   }
     const doctor = await User.create({
       firstName,
       lastName,
       email,
       phone,
       nic,
       dob,
       gender,
       password,
       role: "Doctor",
       doctorDepartment,
       docAvatar: {
         public_id: cloudinaryResponse.public_id,
         url: cloudinaryResponse.secure_url,
       },
     });
     console.log(doctor);
     res.status(200).json({
        success:true,
        message:"🧑‍⚕️👩‍⚕️New Docter Registerd",
        doctor,
     })
});

export const getAllDocters = catchAsyncErrors(async(req,res,next)=>{
    const doctors = await User.find({role:"Doctor"});
    console.log(doctors);
    res.status(200).json({
        success:true,
        doctors,
    });
});

export const getUserDetails = catchAsyncErrors(async(req,res,next)=>{
    const user = req.user;
    res.status(200).json({
        success:true,
        user,
    });
});

//logout function for dashboard admin
export const logoutAdmin = catchAsyncErrors(async (req, res, next) => {
  res.status(201)
    .cookie("adminToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "😔😔Admin Logged Out Successfully.",
    });
});
// Logout function for frontend patient
export const logoutPatient = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("patientToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "😔😔Patient Logged Out Successfully.",
    });
});
