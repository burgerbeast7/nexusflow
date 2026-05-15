'use client';

import { motion } from 'framer-motion';
import { MetricCards } from '@/components/dashboard/MetricCards';
import { VelocityChart } from '@/components/dashboard/VelocityChart';
import { TaskBoard } from '@/components/dashboard/TaskBoard';
import { AISuggestions } from '@/components/dashboard/AISuggestions';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { TeamPresence } from '@/components/dashboard/TeamPresence';

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function DashboardPage() {
  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-surface-400 mt-1">Welcome back. Here&apos;s your project overview.</p>
        </div>
        <div className="flex items-center gap-3">
          <TeamPresence />
        </div>
      </motion.div>

      {/* Metric Cards */}
      <motion.div variants={fadeUp}>
        <MetricCards />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Velocity Chart — spans 2 columns */}
        <motion.div variants={fadeUp} className="lg:col-span-2">
          <VelocityChart />
        </motion.div>

        {/* AI Suggestions */}
        <motion.div variants={fadeUp}>
          <AISuggestions />
        </motion.div>
      </div>

      {/* Task Board & Activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div variants={fadeUp} className="lg:col-span-2">
          <TaskBoard />
        </motion.div>
        <motion.div variants={fadeUp}>
          <ActivityFeed />
        </motion.div>
      </div>
    </motion.div>
  );
}
