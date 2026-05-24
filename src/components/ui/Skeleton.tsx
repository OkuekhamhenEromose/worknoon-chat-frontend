import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-md', className)}
      style={{ background: 'var(--bg-3)', ...style }}
    />
  );
}

export function ConversationSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3">
      <Skeleton style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0 }} />
      <div className="flex-1 min-w-0">
        <Skeleton style={{ height: 13, width: '55%', marginBottom: 8 }} />
        <Skeleton style={{ height: 11, width: '80%' }} />
      </div>
    </div>
  );
}

export function MessageSkeleton({ mine = false }: { mine?: boolean }) {
  return (
    <div className={`flex gap-2 mb-3 ${mine ? 'flex-row-reverse' : ''}`}>
      {!mine && <Skeleton style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0 }} />}
      <Skeleton
        style={{
          height: 40,
          width: '45%',
          borderRadius: 14,
          borderBottomLeftRadius: mine ? 14 : 4,
          borderBottomRightRadius: mine ? 4 : 14,
        }}
      />
    </div>
  );
}
