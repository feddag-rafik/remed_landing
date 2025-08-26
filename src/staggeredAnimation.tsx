"use client";
import { useInView } from "react-intersection-observer";

export default function StaggeredAnimation({
  index,
  increment,
  children,
}: {
  index: number | null | undefined;
  increment?: number;
  children: React.ReactNode;
}) {
  if (!increment) increment = 70;
  if (index === null || index === undefined) return children;
  return (
    <div
      className="staggered"
      style={{ animationDelay: `${index * increment}ms` }}
    >
      {children}
    </div>
  );
}

export function InViewStaggeredAnimation({
  index,
  className,
  increment,
  children,
}: {
  index: number | null | undefined;
  className?: string;
  increment?: number;
  children: React.ReactNode;
}) {
  const { ref, inView } = useInView({
    threshold: 0,
  });
  if (!increment) increment = 70;
  if (index === null || index === undefined) return children;
  return (
    <div
      ref={ref}
      className={`${inView ? `staggered ${className || ""}`  : ""} `}
      style={{
        animationDelay: `${index * increment}ms`,
        opacity: inView ? 0 : 0,
      }}
    >
      {children}
    </div>
  );
}
