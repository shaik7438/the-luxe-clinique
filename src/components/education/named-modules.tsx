"use client";

import Educational3DModule from "./Educational3DModule";

/** Module A — layered skin anatomy explorer. */
export function InteractiveSkinModel({ headingLevel }: { headingLevel?: 2 | 3 }) {
  return <Educational3DModule moduleId="skin" headingLevel={headingLevel} />;
}

/** Module B — laser hair reduction conceptual sequence. */
export function LaserEducationScene({ headingLevel }: { headingLevel?: 2 | 3 }) {
  return <Educational3DModule moduleId="laser" headingLevel={headingLevel} />;
}
