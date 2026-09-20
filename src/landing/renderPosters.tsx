import { renderToStaticMarkup } from "react-dom/server";
import { ProductPreview } from "./ProductPreview";
import { compositions } from "./demoData";

export function renderPosters(): Record<string, string> {
  const kinds = ["patient-records", "prescriptions", "calendar", "accounting", "waiting-room", "medical-imaging"] as const;
  return Object.fromEntries([
    ...kinds.map(kind => [kind, renderToStaticMarkup(<ProductPreview kind={kind} />)]),
    ...compositions.map(demo => [demo.id, renderToStaticMarkup(<ProductPreview kind={demo.id} frame={demo.posterFrame} />)]),
  ]);
}
