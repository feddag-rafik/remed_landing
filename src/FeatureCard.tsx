import { InViewStaggeredAnimation } from "./staggeredAnimation";

export default function FeatureCard({
  color,
  imagePosition,
  title,
  description,
  icon,
  imageUrl,
}: {
  color:
    | "blue"
    | "emerald"
    | "purple"
    | "green"
    | "pink"
    | "yellow"
    | "orange"
    | "red"
    | "gray";
  imagePosition: "left" | "right";
  title: string;
  description: string;
  icon: React.ReactNode;
  imageUrl: string;
}) {
  const image = (
    <img
      src={imageUrl}
      alt={title}
      className={`w-full h-full object-cover rounded-2xl relative bs-${color}`}
    />
  );

  function isMobile() {
    if (typeof window !== "undefined") {
      return window.innerWidth < 800;
    }
    return false;
  }

  const content = (
    <>
      <div>
        <InViewStaggeredAnimation index={1}>
          <div className={`${color}-bg p15 rounded-2xl inline c1`}>{icon}</div>
        </InViewStaggeredAnimation>
      </div>
      <InViewStaggeredAnimation index={2}>
        <h3
          className={`text-2xl ${color}ish font-bold text-gray-900 `}
          style={{ background: "transparent" }}
        >
          {title}
        </h3>
      </InViewStaggeredAnimation>

      <InViewStaggeredAnimation index={3}>
        <p className="text-gray-600 mb-8 leading-relaxed">{description}</p>
      </InViewStaggeredAnimation>
    </>
  );

  if (imagePosition === "left" && !isMobile())
    return (
      <div className={`c2 mc1  acenter p50 mp20  gap20 ${color}ish br`} >
        <InViewStaggeredAnimation className="staggered2" index={1}>
          <div>{image}</div>
        </InViewStaggeredAnimation>

        <div className="p10 c1 gap10 tright">{content}</div>
      </div>
    );

  return (
    <div className={`c2 mc1 p50 mp20 acenter  gap20 ${color}ish br`}>
      <div className="tleft c1 gap10">{content}</div>
      <InViewStaggeredAnimation className="staggered2" index={1}>
        <div>{image}</div>
      </InViewStaggeredAnimation>
    </div>
  );
}
