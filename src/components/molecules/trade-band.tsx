import { Button } from "@/components/atoms/button";

export function TradeBand() {
  return (
    <section className="bg-kyra-red py-8">
      <div className="container-kyra flex flex-col items-start gap-6 px-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between md:px-12 lg:px-20">
        <div>
          <h3 className="font-display text-lg font-semibold italic uppercase text-white sm:text-xl">
            Selling or trading in?
          </h3>
          <p className="mt-1 text-[13px] text-white/85">
            Get a fair valuation from our import specialists within 24 hours.
          </p>
        </div>
        <Button href="/contact" variant="dark" size="md" className="w-full sm:w-auto">
          Get a Valuation
        </Button>
      </div>
    </section>
  );
}
