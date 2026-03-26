import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layers, Zap, PenTool, Database } from 'lucide-react';

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900 font-sans overflow-hidden">
      {/* Navbar */}
      <header className="absolute top-0 inset-x-0 z-50 px-6 py-6 max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-200">
            <Layers size={20} />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">Fetemi</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/auth" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
            Log in
          </Link>
          <Link to="/auth" className="text-sm px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all">
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 max-w-7xl mx-auto">
        {/* Background decorative blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-[1000px] pointer-events-none -z-10">
          <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-indigo-200/40 rounded-full blur-[100px] mix-blend-multiply opacity-70"></div>
          <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-blue-200/40 rounded-full blur-[100px] mix-blend-multiply opacity-70"></div>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-semibold mb-6 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500"></span>
            Elevate Your Marketing Game
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.1]">
            Content automation that feels <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">human.</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Fetemi Agency’s proprietary engine ingests your raw ideas and converts them into distribution-ready campaigns in seconds.
          </motion.p>
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-indigo-200 hover:-translate-y-0.5 transition-all text-lg">
              Launch Engine
            </Link>
          </motion.div>
        </motion.div>

        {/* Feature Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-32 grid md:grid-cols-3 gap-8"
        >
          {[
            { icon: Zap, title: "AI Generation", desc: "Submit a hook, receive 3 distinct stylistic drafts tailored to your audience." },
            { icon: PenTool, title: "Human-in-Loop", desc: "Refine on the fly. Provide conversational feedback to tweak drafts instantly." },
            { icon: Database, title: "Seamless Sync", desc: "One click publishes to your schedule, synced directly to Airtable & n8n." }
          ].map((feature, i) => (
            <motion.div key={i} variants={itemVariants} className="p-8 rounded-3xl bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
                <feature.icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
