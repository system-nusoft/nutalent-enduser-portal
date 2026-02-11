import React from "react";
import logo from "../../assets/svg/LogoBlack.svg";
import styles from "./style.module.scss";

export const MobileFallback = () => {
  return (
    <div className={styles.mobileFallback} role="main" aria-label="Desktop required">
      <div className={styles.card}>
        <img className={styles.logo} src={logo} alt="nuTalent" />

        <p className={styles.text}>
          <strong>This application is only supported on desktop devices.</strong>
          <br />
          <br />
          To proceed, please switch to a PC or laptop device.
        </p>

        <a
          className={styles.button}
          href="https://nutalent.co/"
          target="_blank"
          rel="noreferrer"
        >
          Visit our website
        </a>
      </div>

      <footer className={styles.bottom}>
        <div className={styles.bottomLinks}>
          <a href="https://nutalent.co/information-security" target="_blank" rel="noreferrer">
            Information Security
          </a>
          <a href="https://nutalent.co/privacy-policy" target="_blank" rel="noreferrer">
            Privacy Policy
          </a>
        </div>

        <div className={styles.copy}>
            nuTalent © 2026, a{" "}
            <a
                href="https://nusoft.co/"
                target="_blank"
                rel="noreferrer"
                className={styles.nusoftLink}
            >
                nuSoft
            </a>{" "}
            Company. All rights reserved.
        </div>

        <div className={styles.social}>
          <span>Follow us at –</span>
          <a
            className={styles.linkedin}
            href="https://www.linkedin.com/company/nutalent"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            in
          </a>
        </div>
      </footer>
    </div>
  );
};
