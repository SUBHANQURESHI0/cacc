"use client";

import { useState } from "react";
import { Mail, Copy, Check } from "lucide-react";

export default function EmailLink({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const address = email.trim();


  const gmailCompose =
    "https://mail.google.com/mail/?view=cm&fs=1" +
    `&to=${encodeURIComponent(address)}` +
    `&su=${encodeURIComponent("Re: Your enquiry to CACC")}`;

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <a
        href={gmailCompose}
        target="_blank"
        rel="noopener noreferrer"
        title="Reply in Gmail"
        className="flex items-center gap-2 text-[#00f7ff] transition-colors hover:text-white hover:underline"
      >
        <Mail className="h-4 w-4 shrink-0" />
        <span className="break-all">{address}</span>
      </a>

      <button
        type="button"
        onClick={copyAddress}
        aria-label={copied ? "Address copied" : "Copy email address"}
        title={copied ? "Copied" : "Copy address"}
        className="shrink-0 rounded p-1 text-gray-400 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00f7ff]"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-400" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
