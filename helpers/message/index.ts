import Axios from "axios";

export const Message = async (otp: string, mobile:string) => {
  try {
    const data =
      await Axios.get(`https://api.prpsms.biz/BulkSMSapi/keyApiSendSMS/SendSmsApi?uname=UpenderOjha&pass=Upendra@123&send=SRSGSS&dest=${mobile}&msg=Dear Donar,
Your OTP for registration is ${otp}, Don't share it with anyone. OTP Valid for 5 minutes.
दान करें–कराएं
प्रसादम पाएं।
Shri Radheyshyam Gaushala Samiti&peId=1101519300000083823&teId=1107173399161502025`)
    return Promise.resolve(data?.data);
  } catch (error) {
    return Promise.reject(error);
  }
};
