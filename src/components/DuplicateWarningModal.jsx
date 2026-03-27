import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export default function DuplicateWarningModal({ isOpen, onClose, onProceed }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden relative"
          >
            <div className="p-8">
              <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 mb-6 shadow-inner">
                <AlertTriangle size={28} />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-3 tracking-tight">
                Duplicate Idea Detected
              </h3>
              <p className="text-slate-600 mb-8 leading-relaxed">
                This idea or link has already been processed previously. 
                Do you want to generate fresh drafts anyway?
              </p>
              
              <div className="flex gap-4 justify-end w-full">
                <button 
                  onClick={onClose} 
                  className="px-6 py-3 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors w-full sm:w-auto cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={onProceed} 
                  className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-md hover:shadow-lg transition-all w-full sm:w-auto cursor-pointer text-center"
                >
                  Proceed Anyway
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
