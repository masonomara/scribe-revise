"use client";

import { useState } from "react";
import styles from "../styles/Header.module.css";

const Header = () => {
  return (
    <div className={styles.container}>
      <div>ScribeRevise</div>
      {/* <div className={styles.menuBackground}  /> */}
    </div>
  );
};

export default Header;
