import AnimatedBackground, { type BackgroundScene } from "./AnimatedBackground";
import ParticleField from "./ParticleField";

import scene01 from "@/assets/story-01-spark.jpg";
import scene02 from "@/assets/story-02-recognition.jpg";
import scene03 from "@/assets/story-03-material.jpg";
import scene04 from "@/assets/story-04-industrial.jpg";
import scene05 from "@/assets/story-05-ventures.jpg";
import scene06 from "@/assets/story-06-india.jpg";
import scene07 from "@/assets/story-07-future.jpg";

// 7 cinematic chapters: Spark → Recognition → Carbon Intelligence → Industrial Applications → Venture Builder → India → Future.
const SCENES: BackgroundScene[] = [
  { src: scene01, alt: "The Spark — a single glowing particle in dark space" },
  { src: scene02, alt: "Recognition — blueprints and award-light silhouettes" },
  { src: scene03, alt: "Carbon Intelligence — graphene lattice and nano-materials" },
  { src: scene04, alt: "Industrial Applications — solar, battery, concrete, polymer, fuel, coal" },
  { src: scene05, alt: "Venture Builder — a constellation of operating companies" },
  { src: scene06, alt: "India to the World — India radiating into a global network" },
  { src: scene07, alt: "The Future — a living industrial ecosystem at dawn" },
];

// Darker at the spark and founder/india interludes; lighter through material/stack/future.
const OVERLAY_STOPS = [0.7, 0.55, 0.46, 0.5, 0.52, 0.5, 0.55];

export default function AtmosphereLayer() {
  return (
    <AnimatedBackground scenes={SCENES} overlayStops={OVERLAY_STOPS}>
      {({ progress }) => <ParticleField progress={progress} />}
    </AnimatedBackground>
  );
}
