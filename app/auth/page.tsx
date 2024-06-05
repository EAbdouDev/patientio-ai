import { FC } from "react";
import {
  RegisterLink,
  LoginLink,
} from "@kinde-oss/kinde-auth-nextjs/components";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div>
      <LoginLink postLoginRedirectURL="/dashboard">Sign in</LoginLink>
      <RegisterLink postLoginRedirectURL="/dashboard">Sign up</RegisterLink>
    </div>
  );
};

export default page;
