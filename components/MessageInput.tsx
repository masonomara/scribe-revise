"use client";

import styles from "../styles/MessageInput.module.css";

export default function MessageInput() {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <form className={styles.inputWrapper}>
          <input
            className={styles.topInput}
            placeholder="Type of message"
            autoCorrect="off"
            spellCheck="false"
            autoCapitalize="off"
            type="text"
          ></input>
          <div className={styles.inputDivider} />
          <input
            className={styles.bottomInput}
            placeholder="Message"
            autoCorrect="off"
            spellCheck="false"
            autoCapitalize="off"
            type="text"
          ></input>
        </form>

        <button id="submit-message" className={styles.arrowWrapper}>
          <div className="arrow"></div>
        </button>
      </div>
    </div>
  );
}
