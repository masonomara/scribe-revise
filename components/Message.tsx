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

  const [isCopied, setIsCopied] = useState<boolean>(false);

  async function copyTextToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error("Unable to copy to clipboard using Clipboard API", err);

      try {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);

        return true;
      } catch (err) {
        console.error("Unable to copy to clipboard using execCommand", err);
        return false;
      }
    }
  }

  const handleCopyClick = () => {
    if (revisedMessage) {
      copyTextToClipboard(revisedMessage).then((success) => {
        if (success) {
          setIsCopied(true);
          setTimeout(() => {
            setIsCopied(false);
          }, 1500);
        } else {
        }
      });
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
            <div className={styles.copyButtonWrapper}>
              <button onClick={handleCopyClick} className={styles.copyButton}>
                {isCopied ? "Copied!" : "Copy Message"}
              </button>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Message;
