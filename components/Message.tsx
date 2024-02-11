"use client";

import { useState } from "react";
import styles from "../styles/Message.module.css";

type MessageProps = {
  title: string;
  originalMessageType?: string;
  originalMessage?: string;
  revisions?: string;
  revisedMessage?: string;
};

const Message = ({
  title,
  originalMessageType,
  originalMessage,
  revisions,
  revisedMessage,
}: MessageProps): JSX.Element => {
  const revisionsSections = revisions?.split(/\d+\./).filter(Boolean) || [];

  const [copied, setCopied] = useState<boolean>(false);
  const copyMessage = () => {
    if (revisedMessage) {
      setCopied(true);
      navigator.clipboard.writeText(revisedMessage);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>{title}</div>
      <div className={styles.wrapper}>
        {originalMessage ? (
          <div>
            <p className={styles.originalMessageType}>{originalMessageType}</p>
            <p className={styles.originalMessage}>{originalMessage}</p>
          </div>
        ) : revisions ? (
          revisionsSections.map((revision, index) => (
            <div key={index} className={styles.revisionsSection}>
              <div className={styles.revisionsSectionNumberWrapper}>
                <p className={styles.revisionsSectionNumber}>
                  {(index + 1).toString()}
                </p>
                <div className={styles.revisionsSectionDivider} />
              </div>
              <div>
                <p className={styles.revisionsSectionTitle}>
                  {revision.split(":")[0].trim()}
                </p>
                <p className={styles.revisionsSectionBody}>
                  {revision.split(":")[1].trim()}
                </p>
              </div>
            </div>
          ))
        ) : revisedMessage ? (
          <div>
            <p>{revisedMessage}</p>
            <div className={styles.copyButton}></div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Message;
