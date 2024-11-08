"use client";

import { siteConfig } from "@/config/site";
import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";
import styles from "./Comments.module.css";

export const Comments = () => {
  const commentBox = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const commentsTheme = theme === "dark" ? "github-dark" : "github-light";

    const commentScript = document.createElement("script");
    commentScript.async = true;
    commentScript.src = "https://utteranc.es/client.js";
    // define the name of the repository you created here as 'owner/repo'
    // or import it from your config file if you have one.
    commentScript.setAttribute("repo", siteConfig.comments.repo);
    // define the blog post -> issue mapping (e.g. page pathname, page url).
    // here the issues will be created with the page pathname as the issue title.
    commentScript.setAttribute("issue-term", "pathname");
    // define a custom label that you want added to your posts.
    commentScript.setAttribute("label", siteConfig.comments.label);
    // define if you want to use dark or light theme.
    commentScript.setAttribute("theme", commentsTheme);
    commentScript.setAttribute("crossorigin", "anonymous");

    // we will append this script as a child to the ref element we have created above
    if (commentBox && commentBox.current) {
      commentBox.current.appendChild(commentScript);
    } else {
      console.log(`Error adding utterances comments on: ${commentBox}`);
    }

    return () => {
      commentScript.remove();
      document.querySelectorAll(".utterances").forEach((el) => el.remove());
    };
  }, [theme]);

  return (
    <div className={styles.comments}>
      <div ref={commentBox} />
    </div>
  );
};
