import { LoginForm } from "@/components/auth/LoginFrom";
import { Button } from "@/components/ui/button";
import GoogleIcon from "@/assets/google-alt.svg";
import { Link } from "react-router-dom";
import login1 from "@/assets/login1.png";
import login2 from "@/assets/login2.png";
import { useAuth } from "@/contexts/authContext";

export function Login() {
  const { loginGoogle } = useAuth();

  return (
    <div className="flex justify-center items-center mt-[40px] ">
      <div className="hidden mdl:block">
        <img
          src={login1}
          height={100}
          width={350}
          className="relative top-5 right-6"></img>
      </div>
      <div className="w-[350px] flex flex-col ] justify-center items-center p-10 border-1 border-gray-300/20 ">
        <div className="font-bold text-[40px] text-center pb-5 font-display font ">
          Instagram
        </div>
        <div className="mt-5">
          <LoginForm />
        </div>
        <div className="flex justify-center items-center my-5">
          <div className="border-b border-gray-300/50 w-24"></div>
          <span className="mx-4 text-white ">OR</span>
          <div className="border-b border-gray-300/50 w-24"></div>
        </div>
        <Button className="w-full" onClick={loginGoogle}>
          {" "}
          <img src={GoogleIcon} width={25} height={25}></img>Login with google
        </Button>
        <Link to={"/register"}>
          <p className="text-muted-foreground py-5 text-center">
            Don't have an account yet?
          </p>
        </Link>
      </div>
    </div>
  );
}
