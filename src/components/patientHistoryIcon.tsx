import type { IconType } from "react-icons";
import { BsCapsulePill } from "react-icons/bs";
import { CgFileDocument } from "react-icons/cg";
import { FaRegCalendarAlt, FaStethoscope } from "react-icons/fa";
import { FiActivity } from "react-icons/fi";
import { GrAttachment } from "react-icons/gr";
import { PiBedBold, PiRadioactiveBold, PiWarningBold } from "react-icons/pi";
import { RiMedicineBottleLine, RiTestTubeLine } from "react-icons/ri";
import { TbBed, TbRulerMeasure } from "react-icons/tb";

const historyIcons: Record<string, IconType> = {
  overview: FiActivity,
  consultation: FaStethoscope,
  hospitalisation: PiBedBold,
  exam: RiTestTubeLine,
  intervention: TbBed,
  appointment: FaRegCalendarAlt,
  cure: RiMedicineBottleLine,
  ordonnance: BsCapsulePill,
  mesure: TbRulerMeasure,
  document: CgFileDocument,
  upload: GrAttachment,
  radiotherapy: PiRadioactiveBold,
  antecedent: PiWarningBold,
};

export function PatientHistoryIcon({ kind, size = 18 }: { kind: string; size?: number }) {
  const Icon = historyIcons[kind] || FiActivity;
  return <Icon size={size} aria-hidden="true" />;
}
