"use client";
import styles from "./page.module.css";

interface ErrorPageProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  return (
    <div className={styles.main}>
      <h1>Error</h1>
      <p>Something went wrong</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
