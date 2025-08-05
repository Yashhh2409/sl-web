// app/show-data/page.js

import { Suspense } from "react";
import ShowDataClient from "./ShowDataClient";

export default function Page() {
  return (
    <Suspense fallback={<p>Loading data...</p>}>
      <ShowDataClient />
    </Suspense>
  );
}