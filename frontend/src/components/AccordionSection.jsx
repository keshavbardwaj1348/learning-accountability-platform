import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AccordionSection({ title, subtitle, children }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="rounded-xl border theme-border theme-card">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3"
      >
        <div className="text-left">
          <p className="text-sm opacity-70">{subtitle}</p>
          <p className="text-base font-semibold">{title}</p>
        </div>
        <span className="text-sm opacity-70">{open ? "—" : "+"}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
