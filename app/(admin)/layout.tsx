import Nav from "@components/navigation/Nav";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createClient } from "@lib/supabase/server";
import { FC, ReactNode } from "react";

interface layoutProps {
  children: ReactNode;
}

const layout: FC<layoutProps> = async ({ children }) => {
  const { isAuthenticated, getUser } = getKindeServerSession();
  const user = await getUser();

  // const supabase = createClient();

  // let isAuth = false;

  // const addNewUsersToDB = async () => {
  //   if (!user) {
  //     return;
  //   }

  //   try {
  //     // Check if the user already exists
  //     const { data: existingUser, error: fetchError } = await supabase
  //       .from("patientio_users")
  //       .select("id")
  //       .eq("email", user.email)
  //       .single();

  //     if (fetchError && fetchError.code !== "PGRST116") {
  //       // PGRST116 indicates no rows were found
  //       console.error("Error fetching user:", fetchError);
  //     }

  //     if (existingUser) {
  //       isAuth = true;
  //       return;
  //     }

  //     // Insert new user
  //     const { error: insertError } = await supabase
  //       .from("patientio_users")
  //       .insert([
  //         {
  //           email: user.email,
  //           username:
  //             user.given_name &&
  //             user.given_name + user.family_name &&
  //             user.family_name,
  //         },
  //       ]);

  //     isAuth = true;

  //     if (insertError) {
  //       console.error("Error inserting user:", insertError);
  //     }
  //   } catch (error) {
  //     console.error("Unexpected error:", error);
  //   }
  // };

  // await addNewUsersToDB();

  return (
    <div className="min-h-screen flex flex-col h-screen">
      <header className="">
        {" "}
        <Nav user={user} />
      </header>

      <div className="flex-1 flex flex-row overflow-y-hidden">
        <main className="flex-1  overflow-y-auto py-8  w-full xl:max-w-[80%] 2xl:max-w-[70%] mx-auto border-x  border-gray-100">
          {children}
        </main>
      </div>

      <footer className="border-t border-gray-100 p-4">Footer</footer>
    </div>
  );
};

export default layout;
