'use client';

import { useState } from 'react';
import { createEvaluationAction } from '@/actions/evaluations';
import { Stepper } from '@/components/brand/stepper';
import { ShieldCheck, Upload, Trash2, CheckCircle2 } from 'lucide-react';

export default function NewEvaluationPage() {
  const [title, setTitle] = useState('Nari Boutique Support Assistant');
  const [description, setDescription] = useState(
    "We sell women's fashion online in Cambodia. Customers message us on Telegram and Facebook about orders, sizes and delivery. We want an assistant that answers from our FAQ and policies in Khmer and English, and hands over to a person when it is unsure."
  );
  const [mainTask, setMainTask] = useState('Customer support chat');
  const [conversations, setConversations] = useState<number>(50000);
  const [priority, setPriority] = useState<'cost' | 'quality' | 'speed'>('cost');
  const [convLength, setConvLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const taskOptions = ['Customer support chat', 'Document Q&A', 'Coding', 'Data extraction'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const combined = [...selectedFiles, ...filesArray].slice(0, 5);
      setSelectedFiles(combined);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Step Progress Bar */}
      <div className="rounded-xl overflow-hidden border border-[#D3DDD8] shadow-xs">
        <Stepper currentStep={1} businessTitle={title || 'New Evaluation'} />
      </div>

      {/* Main Container */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.01em] text-[#0A2E2B]">
            Tell us about your business
          </h1>
          <p className="text-sm text-[#4B605C] mt-1">
            Describe it in your own words and add the documents you have. We do the comparison.
          </p>
        </div>

        <form
          action={async (formData: FormData) => {
            setIsSubmitting(true);
            selectedFiles.forEach((file) => formData.append('files', file));
            formData.set('title', title);
            formData.set(
              'description',
              `${description}\n\n[Main Task: ${mainTask} | Priority: ${priority} | Target Conversations: ${conversations}]`
            );
            formData.set('conversationsPerMonth', conversations.toString());
            formData.set('conversationLength', convLength);
            try {
              await createEvaluationAction(formData);
            } catch (err) {
              console.error(err);
              setIsSubmitting(false);
              alert((err as Error).message || 'Failed to analyze business.');
            }
          }}
          className="space-y-6"
        >
          {/* Two-Column Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
            {/* Left Card: Business Description & Operational Scale */}
            <section className="md:col-span-7 bg-white border border-[#D3DDD8] rounded-xl p-6 space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-[#0A2E2B] mb-1.5">
                  Project or Business Name
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Nari Boutique"
                  className="w-full px-3 py-2 text-sm bg-white border border-[#A9BDB7] rounded-lg text-[#0A2E2B] focus:outline-none focus:border-[#0A2E2B] transition"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#0A2E2B] mb-1.5">
                  What does your business do, and what should AI do for it?
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm leading-relaxed bg-white border border-[#A9BDB7] rounded-lg text-[#0A2E2B] focus:outline-none focus:border-[#0A2E2B] transition"
                  placeholder="Describe your customers, languages, policies, and key requirements..."
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#0A2E2B] mb-2">
                  Main task
                </label>
                <div className="flex flex-wrap gap-2">
                  {taskOptions.map((task) => (
                    <button
                      type="button"
                      key={task}
                      onClick={() => setMainTask(task)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition cursor-pointer ${
                        mainTask === task
                          ? 'bg-[#0A2E2B] border-[#0A2E2B] text-white font-semibold'
                          : 'bg-white border-[#A9BDB7] text-[#0A2E2B] hover:border-[#0A2E2B]'
                      }`}
                    >
                      {task}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-[13px] font-semibold text-[#0A2E2B] mb-1.5">
                    Conversations per month
                  </label>
                  <input
                    type="number"
                    min={100}
                    max={5000000}
                    step={1000}
                    value={conversations}
                    onChange={(e) => setConversations(parseInt(e.target.value) || 10000)}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#A9BDB7] rounded-lg text-[#0A2E2B] focus:outline-none focus:border-[#0A2E2B] transition font-sans"
                  />
                  <div className="flex gap-1.5 mt-2">
                    {[10000, 50000, 100000].map((num) => (
                      <button
                        type="button"
                        key={num}
                        onClick={() => setConversations(num)}
                        className={`text-[11px] px-2 py-0.5 rounded border transition ${
                          conversations === num
                            ? 'bg-[#0A2E2B] text-white border-[#0A2E2B]'
                            : 'bg-white border-[#D3DDD8] text-[#4B605C] hover:border-[#0A2E2B]'
                        }`}
                      >
                        {num.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-[#0A2E2B] mb-1.5">
                    What matters most
                  </label>
                  <div className="flex border border-[#A9BDB7] rounded-lg overflow-hidden">
                    {(['cost', 'quality', 'speed'] as const).map((opt) => (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => {
                          setPriority(opt);
                          if (opt === 'quality') setConvLength('long');
                          else if (opt === 'speed') setConvLength('short');
                          else setConvLength('medium');
                        }}
                        className={`flex-1 py-2 text-xs text-center transition capitalize cursor-pointer ${
                          priority === opt
                            ? 'bg-[#0A2E2B] text-white font-semibold'
                            : 'bg-white text-[#4B605C] hover:bg-stone-50'
                        }`}
                      >
                        {opt === 'cost' ? 'Low cost' : opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Right Card: Your Documents & Zero Data Retention */}
            <section className="md:col-span-5 bg-white border border-[#D3DDD8] rounded-xl p-6 space-y-4">
              <div>
                <h3 className="text-[15px] font-semibold text-[#0A2E2B]">
                  Your documents
                </h3>
                <p className="text-xs text-[#4B605C] mt-0.5">
                  Ground scenarios in your real business policies and product catalogs.
                </p>
              </div>

              {/* Upload Dropzone */}
              <div className="relative border-1.5 border-dashed border-[#1F5C55] rounded-xl bg-[#F6FAF8] p-5 flex flex-col items-center justify-center text-center transition hover:bg-[#EDF2EF]">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.docx,.txt,.md"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 26 26"
                  className="text-[#1F5C55] mb-1.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M13 20V7M7 12l6-6 6 6M5 22h16" />
                </svg>
                <b className="text-xs sm:text-sm text-[#0A2E2B]">Drop files here or browse</b>
                <small className="text-[11px] text-[#4B605C] mt-0.5">
                  PDF, Word, or text, up to 10 MB each
                </small>
              </div>

              {/* Uploaded Files List */}
              {selectedFiles.length > 0 ? (
                <div className="space-y-2 pt-1 border-t border-[#D3DDD8]">
                  {selectedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-1.5 border-b border-[#D3DDD8] text-xs"
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        <svg
                          width="16"
                          height="18"
                          viewBox="0 0 18 20"
                          className="flex-shrink-0 text-[#1F5C55]"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinejoin="round"
                        >
                          <path d="M3 1h8l5 5v13H3z" />
                          <path d="M11 1v5h5" />
                        </svg>
                        <span className="font-semibold text-[#0A2E2B] truncate">{file.name}</span>
                        <span className="text-[#4B605C] text-[11px] flex-shrink-0">
                          {(file.size / 1024).toFixed(0)} KB
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#1F5C55]" />
                        <button
                          type="button"
                          onClick={() => removeFile(idx)}
                          className="text-[#4B605C] hover:text-red-600 p-0.5"
                          title="Remove file"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-[12px] text-[#4B605C] italic py-1">
                  No files attached yet. (Optional: default domain scenarios will be generated based on your description).
                </div>
              )}

              {/* Privacy / Zero Data Retention Guarantee */}
              <div className="flex items-start gap-2 pt-2 text-[11px] text-[#4B605C]">
                <ShieldCheck className="w-4 h-4 text-[#1F5C55] flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Zero Data Retention:</strong> Files are parsed strictly in memory and discarded. No data is stored or used for model training.
                </span>
              </div>
            </section>
          </div>

          {/* Bottom CTA Strip */}
          <div className="bg-white border border-[#D3DDD8] rounded-xl p-4 sm:px-6 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-[#4B605C]">
              Next, we match models to your use case and compare the top 3.
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition flex items-center justify-center gap-2 cursor-pointer ${
                isSubmitting ? 'bg-[#4B605C] cursor-not-allowed' : 'bg-[#0A2E2B] hover:bg-[#1F5C55]'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing Business Context...
                </>
              ) : (
                'Find my model'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
