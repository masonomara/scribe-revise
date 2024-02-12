import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import styles from "../page.module.css";

import { createClient } from "@/utils/supabase/server";

export default async function PrivatePage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <div className={styles.main}>
      <p>Hello {data.user.email}</p>;
    </div>
  );
}
