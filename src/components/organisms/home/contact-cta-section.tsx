"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/atoms/button";
import { Eyebrow } from "@/components/atoms/eyebrow";

const CTA_BACKGROUND = "/BMW%27s.jpg";

export function ContactCtaSection() {
  return (
    <section className="relative overflow-hidden border-t border-border py-24 md:py-32">
      <Image
        src={CTA_BACKGROUND}
        alt=""
        fill
        className="object-cover object-center"
        sizes="100vw"
        priority={false}
        aria-hidden
      />
      <div className="line-accent absolute top-0 right-0 left-0 z-10" />

      <div className="container-kyra relative z-10 px-6 text-center md:px-12 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Eyebrow className="justify-center">By Appointment</Eyebrow>
          <h2 className="font-hero mt-4 text-[clamp(2rem,5vw,3.5rem)] leading-[0.98] text-white drop-shadow-sm">
            Ready to experience
            <br />
            <span className="text-kyra-red">KYRA?</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/85 md:text-base">
            Schedule a private consultation with our automotive specialists.
            Whether importing, wrapping, or maintaining — we&apos;re here for you.
          </p>
          <div className="mt-10 flex w-full flex-col items-stretch justify-center gap-4 sm:w-auto sm:flex-row sm:items-center">
            <Button href="/contact" variant="primary" size="lg" magnetic className="w-full sm:w-auto">
              Book Consultation
            </Button>
            <Button href="/imports" variant="secondary" size="lg" magnetic className="w-full sm:w-auto">
              Browse Inventory
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
