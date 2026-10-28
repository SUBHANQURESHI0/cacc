// app/admin/page.tsx
import { PrismaClient, ContactSubmission } from "@prisma/client";
import { Calendar, User, MessageSquare, Clock } from "lucide-react";
import EmailLink from "@/components/EmailLink";

const prisma = new PrismaClient();

// Force dynamic so we always see new data
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const submissions = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-[#012b1d] px-4 pb-4 pt-24 md:px-8 md:pb-8 md:pt-28 text-white font-sans">
      <div className="mx-auto max-w-7xl">
        
        {/* Header Section */}
        <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-[#00f7ff]">
            Admin Dashboard
          </h1>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm text-gray-300 border border-white/10">
            <span>Total Messages:</span>
            <span className="text-[#00f7ff] font-bold">{submissions.length}</span>
          </div>
        </div>

        {/* --- MOBILE VIEW: Cards (Visible on small screens only) --- */}
        <div className="grid gap-4 md:hidden">
          {submissions.map((sub: ContactSubmission) => (
            <div key={sub.id} className="rounded-xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur-sm">
              
              {/* Card Header: Name & Date */}
              <div className="mb-4 flex justify-between items-start">
                <div className="flex items-center gap-2 font-semibold text-lg text-white">
                  <User className="h-5 w-5 text-[#00f7ff]" />
                  {sub.name}
                </div>
                <div className="text-xs text-gray-400 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </div>
                  <div className="mt-1 flex items-center justify-end gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(sub.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              </div>

              {/* Card Body: Email */}
              <div className="mb-3">
                 <EmailLink email={sub.email} />
              </div>

              {/* Card Footer: Message */}
              <div className="rounded-lg bg-black/20 p-3 text-sm text-gray-300 border border-white/5">
                <div className="flex gap-2">
                   <MessageSquare className="h-4 w-4 mt-0.5 shrink-0 opacity-70" />
                   <p className="whitespace-pre-wrap">{sub.message}</p>
                </div>
              </div>

            </div>
          ))}

          {/* Empty State Mobile */}
          {submissions.length === 0 && (
             <div className="p-8 text-center text-gray-400 bg-white/5 rounded-xl border border-white/10">
                No messages found.
             </div>
          )}
        </div>

        {/* --- DESKTOP VIEW: Table (Visible on md screens and up) --- */}
        <div className="hidden md:block overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#00f7ff]/10 text-[#00f7ff]">
                <th className="p-5 font-semibold uppercase text-xs tracking-wider">Date</th>
                <th className="p-5 font-semibold uppercase text-xs tracking-wider">Name</th>
                <th className="p-5 font-semibold uppercase text-xs tracking-wider">Email</th>
                <th className="p-5 font-semibold uppercase text-xs tracking-wider">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {submissions.map((sub: ContactSubmission) => (
                <tr key={sub.id} className="hover:bg-white/5 transition-colors duration-200">
                  <td className="p-5 text-sm text-gray-300 whitespace-nowrap align-top">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 opacity-70" />
                      <span>{new Date(sub.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="mt-1 text-xs text-gray-500 pl-6">
                      {new Date(sub.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </td>
                  <td className="p-5 align-top">
                    <div className="flex items-center gap-2 font-medium text-white">
                      <User className="h-4 w-4 text-[#00f7ff]" />
                      {sub.name}
                    </div>
                  </td>
                  <td className="p-5 align-top">
                    <EmailLink email={sub.email} />
                  </td>
                  <td className="p-5 text-gray-300 align-top min-w-[300px]">
                    <div className="flex gap-2">
                      <MessageSquare className="h-4 w-4 mt-1 shrink-0 opacity-70" />
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{sub.message}</p>
                    </div>
                  </td>
                </tr>
              ))}
              
              {submissions.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-16 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-3">
                      <MessageSquare className="h-10 w-10 opacity-20" />
                      <p>No consultation requests received yet.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
