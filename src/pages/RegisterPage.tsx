import { Link } from "react-router-dom";
import { RegisterForm } from "../components/auth/RegisterForm";

export function Register() {
  return (
    <div className="flex justify-center items-center  ">
      <div className="w-[350px] md:w-[600px] flex flex-col ] justify-center items-center p-10 border-1 border-gray-300/20 ">
        <div className="font-bold text-[40px] text-center pb-5 font-display font ">
          Instagram
        </div>
        <div className="mt-5">
          <RegisterForm />
        </div>
        <div className="flex justify-center items-center my-5">
          <div className="border-b border-gray-300/50 w-24"></div>
          <span className="mx-4 text-white ">OR</span>
          <div className="border-b border-gray-300/50 w-24"></div>
        </div>

        <Link to={"/login"}>
          <p className="text-muted-foreground py-5 text-center">
            Already have an account?
          </p>
        </Link>
      </div>
    </div>
  );
}
