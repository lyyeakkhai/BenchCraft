'use client';

import { useState } from 'react';
import { createEvaluationAction } from '@/actions/evaluations';
import { UploadCloud, Shield, HelpCircle, Sparkles, FileText, X } from 'lucide-react';

export default function NewEvaluationPage() {
  const [conversations, setConversations] = useState<number>(10000);
  const [convLength, setConvLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const presets = [1000, 10000, 50000, 100000];

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
    <div className="max-w-3xl mx-auto space-y-8 py-2">
      {/* Header */}
      <div className="space-y-2 border-b border-gray-200 pb-5">
        <span className="text-xs font-bold uppercase tracking-wider text-[#D97706]">Step 1 of 3</span>
        <h1 className="text-3xl font-extrabold text-[#0C3838]">Describe Your Business & AI Use Case</h1>
        <p className="text-sm text-gray-600">
          BenchCraft analyzes your exact domain, documents, and volume to evaluate candidates in a tailored arena.
        </p>
      </div>

      <form
        action={async (formData: FormData) => {
          setIsSubmitting(true);
          // Append files from state
          selectedFiles.forEach((file) => formData.append('files', file));
          formData.set('conversationsPerMonth', conversations.toString());
          formData.set('conversationLength', convLength);
          try {
            await createEvaluationAction(formData);
          } catch (err) {
            console.error(err);
            setIsSubmitting(false);
            alert((err as Error).message || 'Failed to analyze business. Please check connection.');
          }
        }}
        className="space-y-6"
      >
        {/* Project Name */}
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-semibold text-gray-900">
            Project or Business Name
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue="Nari Boutique Support Assistant"
            placeholder="e.g. Nari Boutique, Logistics FAQ Assistant, Invoice OCR Assistant"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0C3838] bg-white text-sm"
          />
        </div>

        {/* Business Description */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="description" className="block text-sm font-semibold text-gray-900">
              Business Description & AI Requirements
            </label>
            <span className="text-xs text-gray-400">Be as specific as possible</span>
          </div>
          <textarea
            id="description"
            name="description"
            rows={5}
            required
            defaultValue="We are an online fashion boutique in Cambodia selling dresses and shoes. Our AI assistant needs to answer customer questions about clothing sizes, shipping times to Phnom Penh and provinces, return policies, and stock availability in both English and Khmer. High accuracy on product details is critical to maintain customer trust."
            placeholder="Describe what your business does, who talks to the AI, what questions they ask, what languages are spoken, and any high-stakes edge cases..."
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0C3838] bg-white text-sm leading-relaxed"
          />
        </div>

        {/* Volume & Length Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-2xl border border-gray-200">
          {/* Expected Conversations */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-900">
              Expected Volume per Month
            </label>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => setConversations(val)}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border transition ${
                    conversations === val
                      ? 'border-[#0C3838] bg-[#0C3838] text-white shadow-sm'
                      : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-50'
                  }`}
                >
                  {val.toLocaleString()} convs
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs text-gray-500">Custom:</span>
              <input
                type="number"
                min={100}
                max={5000000}
                value={conversations}
                onChange={(e) => setConversations(parseInt(e.target.value) || 1000)}
                className="w-28 px-2.5 py-1 text-xs border rounded-md"
              />
              <span className="text-xs text-gray-500">/ mo</span>
            </div>
          </div>

          {/* Conversation Length */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-900">
              Typical Interaction Length
            </label>
            <div className="space-y-2">
              {[
                { id: 'short', label: 'Short (1–2 turns)', desc: 'Quick Q&A, simple lookups' },
                { id: 'medium', label: 'Medium (3–5 turns)', desc: 'Standard support dialogs' },
                { id: 'long', label: 'Long (6–10 turns)', desc: 'Detailed consultations & drafting' },
              ].map((item) => (
                <label
                  key={item.id}
                  onClick={() => setConvLength(item.id as any)}
                  className={`flex items-start gap-3 p-2.5 rounded-lg border cursor-pointer transition ${
                    convLength === item.id
                      ? 'border-[#0C3838] bg-teal-50/50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="convLengthRadio"
                    checked={convLength === item.id}
                    onChange={() => setConvLength(item.id as any)}
                    className="mt-0.5 text-[#0C3838]"
                  />
                  <div>
                    <div className="text-xs font-bold text-gray-900">{item.label}</div>
                    <div className="text-[11px] text-gray-500">{item.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Document Intake & Privacy Notice */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-gray-900">
              Attach Business Documents (Optional)
            </label>
            <span className="text-xs text-gray-400">PDF, DOCX, TXT, MD (Max 5 files, 10MB each)</span>
          </div>

          <div className="border-2 border-dashed border-gray-300 hover:border-[#0C3838] rounded-2xl p-6 text-center bg-white transition relative">
            <input
              type="file"
              multiple
              accept=".pdf,.docx,.txt,.md"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="space-y-2 pointer-events-none">
              <UploadCloud className="w-8 h-8 text-gray-400 mx-auto" />
              <div className="text-sm font-medium text-gray-700">
                Click to browse or drag & drop business files here
              </div>
              <p className="text-xs text-gray-400">
                Upload product catalogs, support FAQs, or policy sheets to ground the test scenarios
              </p>
            </div>
          </div>

          {/* Uploaded File List */}
          {selectedFiles.length > 0 && (
            <div className="space-y-2 pt-1">
              {selectedFiles.map((f, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span className="font-medium text-gray-800 truncate">{f.name}</span>
                    <span className="text-gray-400">({(f.size / 1024).toFixed(0)} KB)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="text-gray-400 hover:text-red-500 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Privacy Guarantee Banner */}
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900">
            <Shield className="w-4 h-4 text-[#0C3838] flex-shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold text-[#0C3838]">Zero Data Retention Policy:</strong> Your uploaded documents are analyzed strictly in-memory to formulate custom test scenarios. No raw files are ever stored permanently on our servers or used for model training.
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 px-6 rounded-xl font-bold text-white text-base shadow-md transition flex items-center justify-center gap-2 ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#0C3838] hover:bg-[#164E4E] cursor-pointer'
            }`}
          >
            {isSubmitting ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" />
                Analyzing Domain & Formulating Scenarios...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Analyze Business & Generate Scenarios
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
