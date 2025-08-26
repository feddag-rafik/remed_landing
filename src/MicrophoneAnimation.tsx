import { BiMicrophone } from "react-icons/bi";

function MicrophoneAnimation() {
  return (
    <div className="center">
      <div
        className=" black  rounded-xl "
        style={{
          display: "grid",
          height: "70px",
          placeItems: "center",
          gridTemplateColumns: "auto repeat(9, 1fr)",
        }}
      >
        <BiMicrophone className="h-7 w-7" />
        <div className="animatedLine pulse1"></div>
        <div className="animatedLine pulse2"></div>
        <div className="animatedLine pulse3"></div>
        <div className="animatedLine pulse2"></div>
        <div className="animatedLine pulse3"></div>
        <div className="animatedLine pulse4"></div>
        <div className="animatedLine pulse2"></div>
        <div className="animatedLine pulse1"></div>
        <div className="animatedLine pulse3"></div>
      </div>
    </div>
  );
}

export default MicrophoneAnimation;
