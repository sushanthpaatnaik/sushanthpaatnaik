import { Dialog, DialogContent } from "@/components/ui/dialog";
import { InnovationCanvasMount } from "./InnovationCanvas";
import type { ObjectKind } from "./InnovationObject";
import { motion } from "framer-motion";

export interface InnovationDetail {
  title: string;
  domain: string;
  stage: string;
  status: string;
  metric: string;
  body: string;
  img: string;
  kind: ObjectKind;
}

const annotations: Array<{ label: string; value: string }> = [
  { label: "Composition", value: "Graphene · sp² Carbon · Engineered Matrix" },
  { label: "Form Factor", value: "Layered / Dispersed / Surface-Grafted" },
  { label: "Process", value: "Bench → Pilot → Field-Validated" },
  { label: "Lattice Scale", value: "0.142 nm bond length" },
];

export default function InnovationModal({
  open,
  onOpenChange,
  item,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  item: InnovationDetail | null;
}) {
  if (!item) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[min(1280px,96vw)] w-full h-[min(86vh,820px)] p-0 border-foreground/[0.08] bg-[oklch(0.04_0.006_245)] overflow-hidden rounded-sm">
        <div className="relative grid h-full grid-cols-1 md:grid-cols-[1.4fr_1fr]">
          {/* 3D stage */}
          <div className="relative h-full min-h-[320px] border-b md:border-b-0 md:border-r border-foreground/[0.06]">
            <InnovationCanvasMount
              kind={item.kind}
              className="absolute inset-0"
              intense
              cameraZ={3.8}
            />
            {/* corner technical readouts */}
            <div className="pointer-events-none absolute left-5 top-5 z-10 flex items-center gap-2">
              <span className="h-px w-6 bg-accent/70" />
              <span className="font-mono text-[9px] uppercase tracking-[0.38em] text-accent/80">
                Specimen · Exploded View
              </span>
            </div>
            <div className="pointer-events-none absolute right-5 top-5 z-10 font-mono text-[9px] uppercase tracking-[0.32em] text-foreground/45">
              {item.status}
            </div>
            <div className="pointer-events-none absolute bottom-5 left-5 z-10 font-mono text-[9px] uppercase tracking-[0.32em] text-foreground/45">
              REF · {item.title.toUpperCase()}-001
            </div>
            <div className="pointer-events-none absolute bottom-5 right-5 z-10 font-mono text-[9px] uppercase tracking-[0.32em] text-foreground/45">
              {item.domain}
            </div>
          </div>

          {/* Annotations panel */}
          <div className="relative h-full overflow-y-auto px-7 py-9 md:px-9 md:py-11">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
            >
              <p className="font-mono text-[9.5px] uppercase tracking-[0.42em] text-accent/80">
                {item.stage} · Programme
              </p>
              <h2 className="mt-3 font-display text-3xl md:text-4xl tracking-[-0.025em] text-foreground/98 leading-[1.05]">
                {item.title}
              </h2>
              <p className="mt-4 max-w-md text-[14px] leading-relaxed text-foreground/75">
                {item.body}
              </p>

              <div className="mt-7 flex items-center gap-3 border-t border-foreground/[0.08] pt-5">
                <span className="h-px w-6 bg-accent/60" />
                <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/70">
                  {item.metric}
                </span>
              </div>

              <div className="mt-8">
                <p className="mb-4 font-mono text-[9.5px] uppercase tracking-[0.42em] text-foreground/55">
                  System Architecture
                </p>
                <dl className="grid grid-cols-1 gap-y-4">
                  {annotations.map((a, i) => (
                    <motion.div
                      key={a.label}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.15 + i * 0.07, ease: [0.19, 1, 0.22, 1] }}
                      className="grid grid-cols-[140px_1fr] items-baseline gap-4 border-b border-foreground/[0.05] pb-3"
                    >
                      <dt className="font-mono text-[9.5px] uppercase tracking-[0.32em] text-foreground/50">
                        {a.label}
                      </dt>
                      <dd className="font-display text-[14px] tracking-[-0.005em] text-foreground/85">
                        {a.value}
                      </dd>
                    </motion.div>
                  ))}
                </dl>
              </div>

              <div className="mt-8 rounded-sm border border-foreground/[0.06] bg-[oklch(0.05_0.006_245)] px-5 py-4">
                <p className="font-mono text-[9.5px] uppercase tracking-[0.32em] text-foreground/55">
                  Environmental Integration
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-foreground/72">
                  Engineered for industrial-scale deployment — calibrated for
                  long-cycle reliability, low embodied footprint, and continuity
                  across plant, grid and field environments.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
