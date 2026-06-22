import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion';

interface RevealTextProps {
  text: string;
  className?: string;
}

function Char({
  char,
  progress,
  range,
}: {
  char: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  // ponytail: NBSP (U+00A0) para que cada espacio sea un span visible y no colapse en inline-block
  return (
    <motion.span style={{ opacity, display: 'inline-block' }}>
      {char === ' ' ? ' ' : char}
    </motion.span>
  );
}

export default function RevealText({ text, className }: RevealTextProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.4'],
  });

  if (reduce) {
    return (
      <p ref={ref} className={className}>
        {text}
      </p>
    );
  }

  const chars = [...text];
  return (
    <p ref={ref} className={className}>
      {chars.map((char, i) => {
        const start = i / chars.length;
        return (
          <Char
            key={char + i}
            char={char}
            progress={scrollYProgress}
            range={[start - 0.1, start + 0.05]}
          />
        );
      })}
    </p>
  );
}
