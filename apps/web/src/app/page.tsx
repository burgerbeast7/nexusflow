'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Zap, Brain, Shield, BarChart3, Users, Sparkles } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const features = [
  { icon: Brain, title: 'AI Command Bar', desc: 'Natural language to action. "Assign all P0 bugs to Sarah" — done.', color: 'from-violet-500 to-purple-600' },
  { icon: Zap, title: 'Real-Time Board', desc: 'Live cursors, presence indicators, and instant updates across your team.', color: 'from-cyan-500 to-blue-600' },
  { icon: BarChart3, title: 'Predictive Analytics', desc: 'AI predicts sprint velocity, bottlenecks, and completion dates.', color: 'from-emerald-500 to-teal-600' },
  { icon: Shield, title: 'Enterprise Security', desc: 'JWT + OAuth, RBAC, encryption at rest, and SOC2-ready architecture.', color: 'from-amber-500 to-orange-600' },
  { icon: Users, title: 'Team Intelligence', desc: 'Understand workload distribution, skill gaps, and collaboration patterns.', color: 'from-rose-500 to-pink-600' },
  { icon: Sparkles, title: 'Smart Automation', desc: 'Event-driven workflows that automate repetitive tasks intelligently.', color: 'from-indigo-500 to-blue-600' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-950 overflow-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand-600/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent-cyan/8 rounded-full blur-[100px] animate-float" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-accent-violet/6 rounded-full blur-[80px] animate-float" style={{ animationDelay: '-1.5s' }} />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-surface-800/50 bg-surface-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-violet flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">NexusFlow</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-surface-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="https://github.com" className="hover:text-white transition-colors">GitHub</a>
          </div>
          <div className="flex items-center gap-3">
            <a href="/login" className="btn-secondary text-sm">Sign In</a>
            <a href="/dashboard" className="btn-primary text-sm">
              Get Started <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-brand-500/20 bg-brand-500/5 text-brand-400 text-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Powered by AI — Built for scale
          </motion.div>

          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={1}
            className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-6">
            Workflow Intelligence
            <br />
            <span className="gradient-text">Reimagined</span>
          </motion.h1>

          <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={2}
            className="text-lg md:text-xl text-surface-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            NexusFlow combines real-time collaboration, AI automation, and predictive analytics
            into one beautifully crafted platform. Built with microservices architecture,
            designed for 100K+ concurrent users.
          </motion.p>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3}
            className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/dashboard" className="btn-primary text-base px-8 py-3.5 rounded-2xl">
              Launch Dashboard <ArrowRight className="w-5 h-5 ml-2" />
            </a>
            <a href="#architecture" className="btn-secondary text-base px-8 py-3.5 rounded-2xl">
              View Architecture
            </a>
          </motion.div>

          {/* Tech badges */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={4}
            className="flex flex-wrap justify-center gap-3 mt-14">
            {['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'Kubernetes', 'OpenAI', 'WebSocket'].map((tech) => (
              <span key={tech} className="px-3 py-1 text-xs text-surface-500 bg-surface-900/50 border border-surface-800/50 rounded-full">
                {tech}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="px-6 pb-20">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="max-w-6xl mx-auto">
          <div className="glass-card p-1 rounded-3xl shadow-glass-lg">
            <div className="bg-surface-900 rounded-[1.25rem] p-6 min-h-[400px] relative overflow-hidden">
              {/* Mock dashboard */}
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="ml-4 text-xs text-surface-500 font-mono">nexusflow.dev/dashboard</span>
              </div>
              <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Active Tasks', value: '247', change: '+12%', color: 'text-brand-400' },
                  { label: 'Velocity', value: '42 pts', change: '+8.5%', color: 'text-accent-emerald' },
                  { label: 'Sprint Progress', value: '68%', change: 'On Track', color: 'text-accent-cyan' },
                  { label: 'Team Online', value: '12/15', change: '80%', color: 'text-accent-violet' },
                ].map((stat) => (
                  <div key={stat.label} className="glass-card p-4 rounded-xl">
                    <p className="text-xs text-surface-500 mb-1">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-xs text-accent-emerald mt-1">{stat.change}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 glass-card p-4 rounded-xl h-48">
                  <p className="text-sm font-medium text-surface-300 mb-3">Velocity Trend</p>
                  <div className="flex items-end gap-2 h-32">
                    {[35, 42, 38, 45, 40, 48, 42, 50].map((v, i) => (
                      <div key={i} className="flex-1 bg-brand-600/30 rounded-t-md relative" style={{ height: `${v * 2.5}%` }}>
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-500 to-brand-400 rounded-t-md" style={{ height: `${(v / 50) * 100}%` }} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="glass-card p-4 rounded-xl h-48">
                  <p className="text-sm font-medium text-surface-300 mb-3">AI Suggestions</p>
                  <div className="space-y-2">
                    {['Reassign NF-89 to Sarah', 'Sprint 14 may slip 2 days', 'Consider splitting NF-120'].map((s, i) => (
                      <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-surface-800/50">
                        <Sparkles className="w-3.5 h-3.5 text-brand-400 mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-surface-400">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp} custom={0} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Enterprise features, <span className="gradient-text">startup speed</span>
            </h2>
            <p className="text-surface-400 max-w-xl mx-auto">
              Every feature designed for scale, built with obsessive attention to detail.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div key={feature.title} initial="hidden" whileInView="visible"
                viewport={{ once: true }} variants={fadeUp} custom={i}
                className="glass-card p-6 rounded-2xl group hover:border-surface-700/50 transition-all duration-300">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 
                  group-hover:shadow-lg group-hover:shadow-brand-500/20 transition-shadow duration-300`}>
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-surface-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section id="architecture" className="px-6 py-20 border-t border-surface-800/50">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Built for <span className="gradient-text">100K+ users</span>
            </h2>
            <p className="text-surface-400 max-w-xl mx-auto">
              Distributed microservices, Kubernetes orchestration, and AI-powered intelligence.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="glass-card p-8 rounded-2xl font-mono text-sm overflow-x-auto">
            <pre className="text-surface-400 leading-relaxed">
{`┌──────────────┐     ┌─────────────────┐     ┌──────────────┐
│   Frontend   │────▶│   API Gateway   │────▶│  Auth Service │
│   Next.js    │     │  Rate Limiting  │     │  JWT + OAuth  │
│   (CDN)      │     │  Load Balance   │     │  RBAC         │
└──────────────┘     └────────┬────────┘     └──────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
┌────────▼────────┐ ┌────────▼────────┐ ┌────────▼────────┐
│ Workflow Service│ │   AI Service    │ │ Notification Svc│
│ Projects/Tasks  │ │  NLP + Predict  │ │ WebSocket/Email │
│ Sprints/Boards  │ │  OpenAI / RAG   │ │ Presence Track  │
└────────┬────────┘ └────────┬────────┘ └────────┬────────┘
         │                    │                    │
         └────────────────────┼────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
      ┌───────▼──────┐ ┌─────▼─────┐ ┌───────▼──────┐
      │  PostgreSQL  │ │   Redis   │ │  Analytics   │
      │  + Replicas  │ │  Cache +  │ │   Service    │
      │  + Indexing  │ │  Pub/Sub  │ │  Metrics     │
      └──────────────┘ └───────────┘ └──────────────┘`}
            </pre>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to experience the future?
            </h2>
            <p className="text-surface-400 mb-8">
              NexusFlow is open-source and free to deploy. Star us on GitHub.
            </p>
            <div className="flex items-center justify-center gap-4">
              <a href="/dashboard" className="btn-primary text-base px-8 py-3.5 rounded-2xl">
                Launch App <ArrowRight className="w-5 h-5 ml-2" />
              </a>
              <a href="https://github.com" className="btn-secondary text-base px-8 py-3.5 rounded-2xl">
                ⭐ Star on GitHub
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-800/50 py-8 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-surface-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-brand-500 to-accent-violet flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            NexusFlow
          </div>
          <p>Built with ❤️ by engineers who care about craft</p>
        </div>
      </footer>
    </div>
  );
}
