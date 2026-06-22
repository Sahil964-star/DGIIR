import React from 'react';
import { HelpCircle, Phone, Mail, FileText, ArrowRight, ShieldAlert } from 'lucide-react';

const HelpSupportPage = () => {
  const faqs = [
    {
      q: 'How do I accept a newly assigned complaint?',
      a: 'Go to the "Assignments" tab in the sidebar, review the complaint details, and click "Accept". This updates the ticket state to In Progress.'
    },
    {
      q: 'What is the correct procedure for resolving a complaint?',
      a: 'Once you resolve the issue physically on-site, go to "In Progress", click the tools expand button for the complaint, upload the "After Photo" as resolution proof, add closure notes (minimum 10 characters), and submit closure. This transitions the status to Resolved and triggers citizen verification.'
    },
    {
      q: 'How do I reject an assignment?',
      a: 'If a complaint is outside your district boundary or you lack the department-specific equipment, select "Reject" in the assignments section, write down the reason, and confirm. This resets the status to Under Review and returns the ticket to the Operations queue.'
    },
    {
      q: 'What should I do if an SLA breach is approaching?',
      a: 'Check "SLA & Deadlines" to monitor high-risk upcoming breaches. If a task cannot be completed on time, use the "Escalate" action on the incident details page to notify operations coordinators immediately.'
    }
  ];

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Help & Support</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Quick guides, frequently asked questions, and direct support contacts for officers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* FAQs */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-green-600 dark:text-green-500" />
            Frequently Asked Questions
          </h2>
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {faqs.map((faq, i) => (
              <div key={i} className="py-4 first:pt-0 last:pb-0">
                <h4 className="text-sm font-bold text-slate-950 dark:text-white leading-tight">{faq.q}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed font-semibold">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Support & Contacts Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Operations Contact */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Operations Control Room</h3>
            <div className="space-y-3.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>+91 11-23392339</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>ops-support@dgiir.delhi.gov.in</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Available 24/7 for escalation, queries, and backup coordinator requests.</p>
          </div>

          {/* Emergency Directory */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4.5 h-4.5 text-red-500" />
              Emergency Helpline
            </h3>
            <div className="space-y-3 text-xs font-bold">
              <div className="flex justify-between items-center bg-red-500/5 dark:bg-red-500/10 border border-red-500/10 p-2.5 rounded-xl text-red-700 dark:text-red-400">
                <span>National Emergency Number</span>
                <span>112</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl text-slate-700 dark:text-slate-300">
                <span>Delhi Government Helpline</span>
                <span>1076</span>
              </div>
            </div>
          </div>

          {/* User Manual link */}
          <div className="bg-gradient-to-tr from-slate-900 to-slate-800 text-white rounded-3xl p-6 shadow-md flex items-center justify-between group cursor-pointer hover:shadow-lg transition-shadow">
            <div className="min-w-0">
              <h4 className="text-sm font-bold">Officer Field Manual</h4>
              <p className="text-[10px] text-slate-400 mt-1 font-semibold">Download operational workflow guide PDF</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0 hover:bg-white/20 transition-all">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HelpSupportPage;
