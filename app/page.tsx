"use client";

import Message from "@/components/Message";
import styles from "./page.module.css";
import { useState } from "react";
import OpenAI from "openai";

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
      max_tokens: 1024,
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
  const [revisedMessage, setRevisedMessage] = useState<string>("");

  const handleClick = async () => {
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
        }.`
      );

      const revisedMessageOutput = await getOpenAICompletion(
        `I asked for a concise list of the top 5 stylistic shortcomings of this ${
          userMessageType || "copy"
        }: “${userMessage}”. This was your response: “${revisionsOutput}”. Can you rewrite the ${
          userMessageType || "copy"
        } to correct these shortcomings? Return just the rewritten ${
          userMessageType || "copy"
        } with no quotation marks surrounding them.`
      );

      setRevisedMessage(revisedMessageOutput);
    } catch (e) {
      console.error("Error handling click:", e);
    }
  };

  return (
    <main className={styles.main}>
      {originalMessage ? (
        <Message
          title={"Original Message"}
          originalMessage={originalMessage}
          originalMessageType={originalMessageType}
        />
      ) : (
        <>
          <div>In the first 30 years of your life, you make your habits</div>
          <div>Enter your type of message and your message for revisions</div>
          <div>ScribeRevise will deliver a revised message for you to copy</div>
        </>
      )}
      {revisions && <Message title={"Revisions"} revisions={revisions} />}
      {revisedMessage && (
        <Message title={"Revised Message"} revisedMessage={revisedMessage} />
      )}
      <div className={styles.messageInputContainer}>
        <div className={styles.messageInputWrapper}>
          <form className={styles.messageInputInputWrapper}>
            <input
              className={styles.messageInputTopInput}
              placeholder="Type of message"
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
              rows={3}
              onChange={(e) => setUserMessage(e.target.value)}
              value={userMessage}
            />
          </form>

          <button
            id="submit-message"
            className={styles.messageInputArrowWrapper}
            onClick={handleClick}
          >
            <div className="arrow"></div>
          </button>
        </div>
      </div>
    </main>
  );
}
