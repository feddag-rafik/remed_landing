import type { ReactNode } from "react";
import styles from "./pageHeader.module.css";

export default function PageHeader({
  title,
  subTitle,
  trailing,
  className,
}: {
  title: string;
  subTitle?: string;
  trailing?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`${styles.header} ${className || ""}`}>
      <div className={styles.heading}>
        <h2>{title}</h2>
        {subTitle && <div className="gray">{subTitle}</div>}
      </div>
      {trailing && <div className={styles.actions}>{trailing}</div>}
    </div>
  );
}
