import { motion, useReducedMotion, type Variants } from 'framer-motion';

interface WordsPullUpProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'span';
}

const EASE = [0.16, 1, 0.3, 1] as const;

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const word: Variants = {
  hidden: { y: 16, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: EASE } },
};

export default function WordsPullUp({ text, className, as = 'span' }: WordsPullUpProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{text}</Tag>;
  }

  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      {text.split(' ').map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          variants={word}
          style={{ display: 'inline-block', marginRight: '0.25em' }}
        >
          {w}
        </motion.span>
      ))}
    </MotionTag>
  );
}
