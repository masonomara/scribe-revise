"use client";

import { useState } from "react";
import { login, signup } from "../auth/actions";
import styles from "../page.module.css";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";

export default function LoginPage() {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordsMatch, setPasswordsMatch] = useState<boolean>(false);
  const [logIn, setLogIn] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordsMatch(e.target.value === confirmPassword);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
    setPasswordsMatch(e.target.value === password);
  };

  return (
    <div className={styles.main}>
      <div className={styles.menuWrapper} onClick={() => setMenuOpen(true)}>
        <Image src="/menu.svg" width={22} height={22} alt="Menu" />
      </div>
      <div
        className={
          !menuOpen
            ? styles.sidebar
            : `${styles.sidebar} ${styles.sidebarForceOpen}`
        }
      >
        <div className={styles.sidebarHeader}>
          <div
            className={styles.closeMenuWrapper}
            onClick={() => setMenuOpen(false)}
          >
            <Image src="/close.svg" width={22} height={22} alt="Menu" />
          </div>
          <div className={styles.menuEmailWrapper}>
            <p className={styles.menuEmail}>Message History</p>
          </div>
        </div>
      </div>

      <div className={styles.messageContainer}>
        <div className={styles.signUpForm}>
          <p className={styles.signUpFormTitle}>
            {logIn ? "Log In" : "Get Started"}
          </p>

          <form className={styles.signUpFormWrapper}>
            <label htmlFor="email" className={styles.signUpLabel}>
              Email:
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoCorrect="off"
              spellCheck="false"
              autoCapitalize="off"
              className={styles.signUpInput}
            />
            <label htmlFor="password" className={styles.signUpLabel}>
              Password:
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoCorrect="off"
              spellCheck="false"
              autoCapitalize="off"
              className={styles.signUpInput}
              onChange={handlePasswordChange}
            />
            {!logIn && (
              <>
                <label htmlFor="confirmpassword" className={styles.signUpLabel}>
                  Confirm Password:
                </label>
                <input
                  id="confirmpassword"
                  name="confirmpassword"
                  type="password"
                  required
                  autoCorrect="off"
                  spellCheck="false"
                  autoCapitalize="off"
                  className={styles.signUpInput}
                  onChange={handleConfirmPasswordChange}
                />
              </>
            )}

            <div
              className={`${styles.signUpButtons} ${
                passwordsMatch || logIn ? "" : styles.signUpButtonsDisabled
              }`}
            >
              {loading ? (
                <div className="lds-ring">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              ) : logIn ? (
                <button
                  formAction={login}
                  // onClick={() => setLoading(true)}
                  className={styles.signUpLogin}
                >
                  Log In
                </button>
              ) : (
                <button
                  formAction={signup}
                  // onClick={() => setLoading(true)}
                  className={styles.signUpLogin}
                >
                  Sign up
                </button>
              )}
            </div>
            <div
              className={styles.logInSecondaryButton}
              onClick={() => {
                setLogIn(!logIn);
              }}
            >
              {logIn
                ? "Create an account."
                : "Already have an account? Log in here."}
            </div>
          </form>
        </div>
      </div>

      {/* <form>
        <label htmlFor="email">Email:</label>
        <input id="email" name="email" type="email" required />
        <label htmlFor="password">Password:</label>
        <input id="password" name="password" type="password" required />
        <button formAction={login}>Log in</button>
        <button formAction={signup}>Sign up</button>
      </form> */}
    </div>
  );
}
