import AnimatedBackground, { type BackgroundScene } from "./AnimatedBackground";
import ParticleField from "./ParticleField";

import scene01 from "@/assets/story-01-spark.jpg";
import scene02 from "@/assets/story-02-origin.jpg";
import scene03 from "@/assets/story-03-material.jpg";
import scene04 from "@/assets/story-04-stack.jpg";
import scene05 from "@/assets/story-05-founder.jpg";
import scene06 from "@/assets/story-06-india.jpg";
import scene07 from "@/assets/story-07-future.jpg";

// 7 cinematic chapters: Spark → Origin → Material → Stack → Founder → India → Future.
const SCENES: BackgroundScene[] = [
  { src: scene01, alt: "The Spark — single particle, idea forming in the void" },
  { src: scene02, alt: "Origin — young inventor's workshop, gadgets and blueprints" },
  { src: scene03, alt: "The Material Layer — graphene honeycomb lattice" },
  { src: scene04, alt: "The Innovation Stack — solar, battery, polymer, concrete" },
  { src: scene05, alt: "The Founder Layer — constellation of companies" },
  { src: scene06, alt: "India to the World — India glowing outward to global network" },
  { src: scene07, alt: "The Future System — living industrial ecosystem at dawn" },
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
