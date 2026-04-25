import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {Hero, Perks, EventsCarousel, CategoryCarousel, Featured, Testimonials} from "./sections";
import {Background} from "./components";
import {Divider} from "./layouts";
import {ErrorComponent} from "../shared";

export default function Home() {
  return (
    <ErrorBoundary FallbackComponent={({ error }) => <ErrorComponent error={error} />}>
      <Suspense fallback={<div>Loading...</div>}>
        <Hero/>
        <Perks/>
        <EventsCarousel/>
        <CategoryCarousel />
        <Divider />
        <Featured/>
        <Divider />
        <Testimonials/>
        <Background />
      </Suspense>
    </ErrorBoundary>
  );
}