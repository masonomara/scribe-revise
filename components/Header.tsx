"use client";

import { useState } from "react";
import styles from "../styles/Header.module.css";

const Header = () => {
  return (
    <div className={styles.container}>
      <h1>ScribeRevise</h1>
      {/* <div className={styles.menuBackground}  /> */}
    </div>
  );
};

export default Header;
