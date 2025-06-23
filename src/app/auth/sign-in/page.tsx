import { Card } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { SignInViews } from "@/modules/auth/ui/views/sign-in-views";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
const SignInPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!!session) {
    redirect("/");
  }

  return <SignInViews />;
};

export default SignInPage;
