import { WhatsAppIcon } from "@/components/atoms/whatsapp-icon";
import { cn, formatWhatsAppLink } from "@/lib/utils";

const WHATSAPP_PHONE = "254724809009";
const WHATSAPP_MESSAGE =
  "Hi, thank you for contacting KYRA. Someone from the team will get back to you soon.";

interface WhatsAppFloatProps {
  phone?: string;
  message?: string;
  className?: string;
}

export function WhatsAppFloat({
  phone = WHATSAPP_PHONE,
  message = WHATSAPP_MESSAGE,
  className,
}: WhatsAppFloatProps) {
  const href = formatWhatsAppLink(phone, message);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with KYRA on WhatsApp"
      className={cn(
        "group fixed right-5 bottom-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_0_0_3px_rgba(37,211,102,0.35),0_0_20px_rgba(37,211,102,0.55),0_8px_24px_rgba(37,211,102,0.4)] transition-transform duration-300 hover:scale-105 hover:shadow-[0_0_0_4px_rgba(37,211,102,0.4),0_0_28px_rgba(37,211,102,0.7),0_8px_28px_rgba(37,211,102,0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] md:right-8 md:bottom-8",
        className
      )}
    >
      <WhatsAppIcon size={28} className="transition-transform duration-300 group-hover:scale-110" />
      <span className="sr-only">WhatsApp</span>
    </a>
  );
}
