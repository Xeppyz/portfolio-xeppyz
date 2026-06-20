import { ElementType, ComponentPropsWithoutRef } from 'react';

type GlassProps<T extends ElementType = 'div'> = {
  as?: T;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className'>;

export default function Glass<T extends ElementType = 'div'>({
  as,
  className = '',
  ...rest
}: GlassProps<T>) {
  const Tag = (as ?? 'div') as ElementType;
  return <Tag className={`glass ${className}`.trim()} {...rest} />;
}
