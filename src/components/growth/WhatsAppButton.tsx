import { trackEvent } from "@/hooks/use-track-event";

const PHONE = "212668546358";
const MSG = "Hi HN-GROUPE 👋, I'd like to discuss a project.";

export function WhatsAppButton() {
  const href = `https://api.whatsapp.com/send?phone=${PHONE}&text=${encodeURIComponent(MSG)}&type=phone_number&app_absent=0`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => void trackEvent("whatsapp_click", { source: "floating" })}
      aria-label="Chat on WhatsApp"
      className="fixed bottom-24 right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-2xl shadow-[#25D366]/40 transition-transform hover:scale-110 sm:bottom-28 sm:right-6"
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7 fill-current" aria-hidden>
        <path d="M19.11 17.21c-.27-.14-1.59-.78-1.84-.87-.25-.09-.43-.14-.61.14-.18.27-.7.87-.86 1.05-.16.18-.32.2-.59.07-.27-.14-1.13-.42-2.16-1.33-.8-.71-1.34-1.59-1.5-1.86-.16-.27-.02-.42.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47h-.52c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.29 0 1.35.98 2.66 1.12 2.84.14.18 1.93 2.95 4.69 4.13.66.28 1.17.45 1.57.58.66.21 1.26.18 1.74.11.53-.08 1.59-.65 1.81-1.28.22-.63.22-1.17.16-1.28-.07-.11-.25-.18-.52-.32zM16.02 5.33c-5.89 0-10.67 4.78-10.67 10.67 0 1.88.49 3.71 1.43 5.32L5.34 26.67l5.5-1.43c1.55.85 3.3 1.3 5.18 1.3 5.89 0 10.67-4.78 10.67-10.67S21.91 5.33 16.02 5.33zm0 19.51c-1.69 0-3.34-.45-4.78-1.31l-.34-.2-3.27.85.87-3.18-.22-.35a8.84 8.84 0 0 1-1.36-4.66c0-4.89 3.99-8.87 8.88-8.87 4.89 0 8.87 3.98 8.87 8.87s-3.99 8.85-8.87 8.85z" />
      </svg>
    </a>
  );
}
