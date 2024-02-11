"use client";

import Message from "@/components/Message";
import styles from "./page.module.css";
import MessageInput from "@/components/MessageInput";
import OpenAI from "openai";
import { useState } from "react";

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY as string;

async function getOpenAICompletion(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  try {
    const openai = new OpenAI({
      organization: "org-D1z86MYrzIyvjVFQXShnMvrr",
      apiKey: OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "Write a concise list of the top 5 stylistic shortcomings of these testimonials: Wellness Consulting Emily, CEO - Meg totally reframed my relationship with food. I had no balance. I was always either gorging myself on a glutinous meal or fasting and eating nothing but salads and drinking water. There was no in between. Meg taught me how to truly recognize what foods were best for me (and not just those that LOOKED healthy) and how to enjoy foods that were good for me. Just because it’s a healthy balance doesn’t mean it has to taste bad. Meg encouraged me every week to continue towards my goal and I saw real results - I lost 10 pounds! She is such a good coach. She’s firm but encouraging and such a great cheerleader! Abby, NCAA Coach - Before I began working with Meg, I wouldn’t have considered myself a very healthy eater. I pretty much ate what I wanted when I wanted. I enjoyed a work out every now and then but never really found a routine that I liked best. I was excited to take the next step and become more serious about my nutrition and fitness. Meg made that transition very easy and started nice and slow by setting some goals for myself. From there we moved into education on how food affects our body and what our bodies need to function. I found a workout routine that I enjoyed very much and actually saw results from! I had weekly calls with Meg to check in on my goals and set prescriptions for my progress tailored to each week. Meg guided me along the way and answered all of my questions. I could not have done this without her and highly recommend Meg to any and all! VanessaMarisa Private Pilates Coaching Kathy, retired athlete - Meg is wonderful to work with, we are focused, and I feel energized after our session, such a great mind and body connection that breaks up the day! Discovering good results! Tonya, Mental Skills Coach - Meg's pilates lessons have been absolutely terrific for me and my riding. She is patient, clear, inspiring and has a very grounded approach to strength and wellness. I appreciate her guidance and flexibility in making our sessions work no matter where we both are in the world. I highly recommend Meg!! Breathwork Coaching Anders, Tech CEO - Doing breathwork with Meg has been a game changer for me. The biggest change I've seen has been in my sleep. The natural body high that comes from the session knocks me out and puts me in a deep sleep, and I wake up the next morning feeling amazing. It's also upped my meditation game, and has led to a heightened sense of mindfulness in everything I do. This is a must-do for high performance.  Jody, retired NHL player - Nick, Friend - I will admit I was open-minded but also skeptical when Meg convinced me to participate in a session, but I can genuinely say it was a legitimately eye-opening physical and emotional experience that I'd recommend to anyone. Meg's comforting presence is the perfect introduction to the world of breathwork, and I can't wait for my next session! Breana, Account Executive - I experienced Meg’s exceptional coaching abilities firsthand during a semi-private session. Meg made our (new to breathwork) group extremely comfortable and guided us with effective cues. Even after one session I felt an internal shift along with a desire to continue exploring this practice. Also playlist is fire.",
        },
      ],
      model: "gpt-3.5-turbo",
      max_tokens: 1024,
    });

    let content = completion.choices[0]?.message?.content?.trim() ?? "";
    console.log("OpenAI Output: \n", content);
    return content;
  } catch (e) {
    console.error("Error getting data:", e);
    throw e;
  }
}

export default function Home() {
  const [originalMessage, setOriginalMessage] = useState<string>();
  const [revisions, setRevisions] = useState<string>();
  const [revisedMessage, setRevisedMessage] = useState<string>();
  const handleClick = async () => {
    const result = await getOpenAICompletion("systemPrompt", "userPrompt");
    setRevisions(result);
  };
  return (
    <main className={styles.main}>
      <Message title={"Original Message"} originalMessage={originalMessage} />
      <Message title={"Revisions"} revisions={revisions} />
      <Message title={"Revised Message"} revisedMessage={revisedMessage} />
      <MessageInput />
      <button onClick={handleClick}>Nut!</button>
    </main>
  );
}
