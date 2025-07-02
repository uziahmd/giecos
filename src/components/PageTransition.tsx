import { motion } from 'framer-motion';
import React from 'react';

type Props = {
  children: React.ReactNode;
};

const variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

export default function PageTransition({ children }: Props) {
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.2 }}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
}
