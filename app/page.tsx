"use client";

import Message from "@/components/Message";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import OpenAI from "openai";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { login, signup } from "./auth/actions";

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY as string;

async function getOpenAICompletion(systemPrompt: string): Promise<string> {
  try {
    const openai = new OpenAI({
      organization: "org-D1z86MYrzIyvjVFQXShnMvrr",
      apiKey: OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    const response = await openai.chat.completions.create({
      messages: [{ role: "system", content: systemPrompt }],
      model: "gpt-3.5-turbo-0125",
    });

    const output = response.choices[0]?.message?.content?.trim() ?? "";
    console.log("OpenAI Output:\n", output);
    return output;
  } catch (e) {
    console.error("Error getting OpenAI completion:", e);
    throw e;
  }
}

export default function Home() {
  const [userMessage, setUserMessage] = useState<string>("");
  const [userMessageType, setUserMessageType] = useState<string>("");
  const [originalMessage, setOriginalMessage] = useState<string>("");
  const [originalMessageType, setOriginalMessageType] = useState<string>("");
  const [revisions, setRevisions] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [revisedMessage, setRevisedMessage] = useState<string>("");
  const [user, setUser] = useState<any>(null);

  const [messageHistory, setMessageHistory] = useState<any[]>([]);
  const [signUp, setSignUp] = useState<boolean>(false);

  const formatDate = (published: any): string => {
    const options: Intl.DateTimeFormatOptions = {
      month: "numeric",
      day: "numeric",
      year: "2-digit",
    };

    return new Intl.DateTimeFormat("en-US", options).format(
      new Date(published)
    );
  };

  useEffect(() => {
    const fetchUserMessages = async () => {
      try {
        const supabase = createClient();
        if (user?.user?.id) {
          console.log("beginning to fetch feeds with", user?.user?.email);
          const { data, error } = await supabase
            .from("messages")
            .select("*")
            .eq("userId", user?.user?.id);

          if (error) {
            console.error("Error fetching user messages 1:", error);
          } else {
            console.log("fetched messages:", data);

            const sortedMessages = data.sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            );
            setMessageHistory(sortedMessages || []);
          }
        }
      } catch (e) {
        console.error("Error fetching user messages 2:", e);
      }
    };

    fetchUserMessages();
  }, [user]);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();

      setUser(data);
    };

    fetchUser();
  }, []);

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setUserMessage("");
    setUserMessageType("");
    setRevisions("");
    setRevisedMessage("");
    setOriginalMessage("");
    setOriginalMessageType("s");

    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log("no silly");
    }
    setUser(null);
  };

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      setUserMessage("");
      setUserMessageType("");
      setRevisions("");
      setRevisedMessage("");
      setOriginalMessage(userMessage);
      setOriginalMessageType(userMessageType);

      console.log(
        `revisionsInput: Write a concise list of the top 5 stylistic shortcomings of this ${
          userMessageType || "copy"
        }: “${userMessage}”. Return the list in the following format: 1. Example shortcoming: Shortcoming description.`
      );

      const revisionsOutput = await getOpenAICompletion(
        `Write a concise list of the top 5 stylistic shortcomings of this ${
          userMessageType || "copy"
        }: “${userMessage}”. Return the list in the following format: 1. Example shortcoming: Shortcoming description.`
      );

      setRevisions(revisionsOutput);

      console.log(
        `revisedMessageInput: I asked for a concise list of the top 5 stylistic shortcomings of this ${
          userMessageType || "copy"
        }: “${userMessage}”. This was your response: “${revisionsOutput}”. Can you rewrite the ${
          userMessageType || "copy"
        } to correct these shortcomings? Return just the rewritten ${
          userMessageType || "copy"
        } with no quotation marks surrounding them`
      );

      const revisedMessageOutput = await getOpenAICompletion(
        `I asked for a concise list of the top 5 stylistic shortcomings of this ${
          userMessageType || "copy"
        }: “${userMessage}”. This was your response: “${revisionsOutput}”. Can you rewrite the ${
          userMessageType || "copy"
        } to correct these shortcomings? Return just the rewritten ${
          userMessageType || "copy"
        } with no quotation marks surrounding them`
      );

      setRevisedMessage(revisedMessageOutput);

      const supabase = createClient();
      const { data, error } = await supabase
        .from("messages")
        .upsert([
          {
            originalMessage: userMessage,
            originalMessageType: userMessageType,
            revisions: revisionsOutput,
            revisedMessage: revisedMessageOutput,
            userId: user?.user?.id,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error inserting data into Supabase:", error);
      } else {
        console.log("Data inserted successfully:", data);
      }
    } catch (e) {
      console.error("Error handling click:", e);
    }
  };

  return (
    <main className={styles.main}>
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
            <Image src="/menu.svg" width={22} height={22} alt="Menu" />
          </div>
          <div className={styles.menuEmailWrapper}>
            <p className={styles.menuEmail}>Message History</p>
          </div>
        </div>
        {user?.user ? (
          <>
            <div className={styles.messageItemContainer}>
              {messageHistory.map((message) => (
                <div key={message.id}>
                  <div className={styles.messageItem}>
                    {/* Render each message item here */}
                    <div className={styles.messageItemText}>
                      <div className={styles.messageItemHeadWrapper}>
                        <p className={styles.messageItemHeader}>
                          {message.originalMessageType}
                        </p>
                        <p className={styles.messageItemDate}>
                          {formatDate(message.created_at)}
                        </p>
                      </div>
                      <p className={styles.messageItemBody}>
                        {message.revisedMessage}
                      </p>
                    </div>
                  </div>
                  <div className={styles.messageItemBorder} />
                </div>
              ))}
            </div>

            <div className={styles.signOutButtonWrapper}>
              <button onClick={handleLogout} className={styles.signOutButton}>
                Log Out
              </button>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>

      <div className={styles.messageContainer}>
        <div
          className={
            originalMessage
              ? `${styles.messageFadeWrapperOn}`
              : `${styles.messageFadeWrapperOff}`
          }
        >
          <Message
            title={"Original Message"}
            originalMessage={originalMessage}
            originalMessageType={originalMessageType}
          />
        </div>
        {signUp ? (
          <div className={styles.signUpForm}>
            <p className={styles.signUpFormTitle}>Get Started</p>

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
              />
              <div className={styles.signUpButtons}>
                <button formAction={signup} className={styles.signUpSignUp}>
                  Sign up
                </button>
                <button formAction={login} className={styles.signUpLogin}>
                  Log in
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div
            className={
              originalMessage
                ? `${styles.emptyContainerOff}`
                : `${styles.emptyContainerOn}`
            }
          >
            <div className={styles.styleGrid}>
              <Image
                src="/complete.svg"
                width={15}
                height={15}
                alt="Scribe Revise"
              />
              <Image
                src="/scramble.svg"
                width={15}
                height={15}
                alt="Scribe Revise"
              />
              <Image
                src="/complete.svg"
                width={15}
                height={15}
                alt="Scribe Revise"
              />
              <Image
                src="/scramble.svg"
                width={15}
                height={15}
                alt="Scribe Revise"
              />
              <Image
                src="/scramble.svg"
                width={15}
                height={15}
                alt="Scribe Revise"
              />
              <Image
                src="/complete.svg"
                width={15}
                height={15}
                alt="Scribe Revise"
              />
              <Image
                src="/scramble.svg"
                width={15}
                height={15}
                alt="Scribe Revise"
              />
              <Image
                src="/scramble.svg"
                width={15}
                height={15}
                alt="Scribe Revise"
              />
              <Image
                src="/complete.svg"
                width={15}
                height={15}
                alt="Scribe Revise"
              />
              <Image
                src="/scramble.svg"
                width={15}
                height={15}
                alt="Scribe Revise"
              />
              <Image
                src="/complete.svg"
                width={15}
                height={15}
                alt="Scribe Revise"
              />
              <Image
                src="/scramble.svg"
                width={15}
                height={15}
                alt="Scribe Revise"
              />
              <Image
                src="/scramble.svg"
                width={15}
                height={15}
                alt="Scribe Revise"
              />
              <Image
                src="/complete.svg"
                width={15}
                height={15}
                alt="Scribe Revise"
              />
              <Image
                src="/scramble.svg"
                width={15}
                height={15}
                alt="Scribe Revise"
              />
              <Image
                src="/complete.svg"
                width={15}
                height={15}
                alt="Scribe Revise"
              />
            </div>
            <p className={styles.styleText}>
              Enter your message and optionally the message type for revisions.
            </p>
            <div className={styles.styleGridTwo}>
              <Image
                src="/complete-background.svg"
                width={15}
                height={15}
                alt="Scribe Revise"
              />
              <Image
                src="/complete-background.svg"
                width={15}
                height={15}
                alt="Scribe Revise"
              />
              <Image
                src="/complete-background.svg"
                width={15}
                height={15}
                alt="Scribe Revise"
              />
              <Image
                src="/complete-background.svg"
                width={15}
                height={15}
                alt="Scribe Revise"
              />
              <Image
                src="/complete-background.svg"
                width={15}
                height={15}
                alt="Scribe Revise"
              />
              <Image
                src="/complete-background.svg"
                width={15}
                height={15}
                alt="Scribe Revise"
              />
              <Image
                src="/complete-background.svg"
                width={15}
                height={15}
                alt="Scribe Revise"
              />
              <Image
                src="/complete-background.svg"
                width={15}
                height={15}
                alt="Scribe Revise"
              />
              <Image
                src="/complete-background.svg"
                width={15}
                height={15}
                alt="Scribe Revise"
              />
              <Image
                src="/complete-background.svg"
                width={15}
                height={15}
                alt="Scribe Revise"
              />
              <Image
                src="/complete-background.svg"
                width={15}
                height={15}
                alt="Scribe Revise"
              />
              <Image
                src="/complete-background.svg"
                width={15}
                height={15}
                alt="Scribe Revise"
              />
              <Image
                src="/complete-background.svg"
                width={15}
                height={15}
                alt="Scribe Revise"
              />
              <Image
                src="/complete-background.svg"
                width={15}
                height={15}
                alt="Scribe Revise"
              />
              <Image
                src="/complete-background.svg"
                width={15}
                height={15}
                alt="Scribe Revise"
              />
              <Image
                src="/complete-background.svg"
                width={15}
                height={15}
                alt="Scribe Revise"
              />
            </div>
            <p className={styles.styleText}>
              ScribeRevise will revise and rewrite the message for you.
            </p>
          </div>
        )}

        {!revisions && !originalMessage ? (
          <></>
        ) : !revisions && originalMessage ? (
          <div className="lds-ring-container">
            <div className="lds-ring">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <p className={styles.styleText}>Writing Revisions</p>
          </div>
        ) : (
          <></>
        )}
        <div
          className={
            revisions
              ? `${styles.messageFadeWrapperOn}`
              : `${styles.messageFadeWrapperOff}`
          }
        >
          <Message title={"Revisions"} revisions={revisions} />
        </div>
        {!revisedMessage && !revisions && !originalMessage ? (
          <></>
        ) : !revisedMessage && !revisions && originalMessage ? (
          <></>
        ) : !revisedMessage && revisions && originalMessage ? (
          <div className="lds-ring-container">
            <div className="lds-ring">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <p className={styles.styleText}>Writing Revised Message</p>
          </div>
        ) : (
          <></>
        )}
        <div
          className={
            revisedMessage
              ? `${styles.messageFadeWrapperOn}`
              : `${styles.messageFadeWrapperOff}`
          }
        >
          <Message title={"Revised Message"} revisedMessage={revisedMessage} />
        </div>
      </div>

      <div className={styles.messageInputContainer}>
        {user?.user ? (
          <div className={styles.messageInputWrapper}>
            <form className={styles.messageInputInputWrapper} id="messageInput">
              <input
                className={styles.messageInputTopInput}
                placeholder="Message Type (email, article, etc.)"
                autoCorrect="off"
                spellCheck="false"
                autoCapitalize="off"
                type="text"
                onChange={(e) => setUserMessageType(e.target.value)}
                value={userMessageType}
              />
              <div className={styles.messageInputInputDivider} />
              <textarea
                className={styles.messageInputBottomInput}
                placeholder="Message"
                autoCorrect="off"
                spellCheck="false"
                autoCapitalize="off"
                rows={1}
                onChange={(e) => setUserMessage(e.target.value)}
                value={userMessage}
              />
              <button
                id="submit-message"
                form="messageInput"
                className={
                  userMessage != ""
                    ? styles.messageInputArrowWrapper
                    : styles.messageInputArrowWrapperDisabled
                }
                onClick={handleClick}
                disabled={userMessage === ""}
              >
                <div className={styles.messageInputButton}>
                  <Image
                    className="arrow"
                    src="/arrow.svg"
                    width={18}
                    height={18}
                    alt="Scribe Revise"
                  />
                </div>
              </button>
            </form>
          </div>
        ) : (
          <div className={styles.messageInputWrapper}>
            <div
              onClick={() => setSignUp(!signUp)}
              className={
                signUp ? styles.exitStartedButton : styles.getStartedButton
              }
            >
              {signUp ? "Exit" : "Get Started"}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
