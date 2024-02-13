"use client";

import { login, signup } from "../auth/actions";
import styles from "../page.module.css";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const handleSignInWithGoogle = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    const supabase = createClient();
    const signInWIthGoogle = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  return (
    <div className={styles.main}>
      <form>
        <label htmlFor="email">Email:</label>
        <input id="email" name="email" type="email" required />
        <label htmlFor="password">Password:</label>
        <input id="password" name="password" type="password" required />
        <button formAction={login}>Log in</button>
        <button formAction={signup}>Sign up</button>
      </form>
      {/* <button onClick={handleSignInWithGoogle}>Google</button> */}
    </div>
  );
}
