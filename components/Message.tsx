import styles from "../styles/Message.module.css";

type MessageProps = {
  title: string;
  originalMessage?: string;
  revisions?: string;
  revisedMessage?: string;
};

const Message = ({
  title,
  originalMessage,
  revisions,
  revisedMessage,
}: MessageProps): JSX.Element => {
  const revisionsSections = revisions?.split(/\d+\./).filter(Boolean) || [];

  return (
    <div className={styles.container}>
      <div className={styles.title}>{title}</div>
      <div className={styles.wrapper}>
        {originalMessage ? (
          <div>{originalMessage}</div>
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
          <div>{revisedMessage}</div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Message;
