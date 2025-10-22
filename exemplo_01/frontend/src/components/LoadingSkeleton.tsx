interface LoadingSkeletonProps {
  type?: "card" | "table" | "chat" | "stats";
  count?: number;
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      </div>
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
  );
}

function SkeletonTable() {
  return (
    <div className="animate-pulse">
      <div className="h-12 bg-gray-200 rounded-t-lg mb-2"></div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 bg-gray-100 mb-1 rounded"></div>
      ))}
    </div>
  );
}

function SkeletonChat() {
  return (
    <div className="space-y-4 p-4 animate-pulse">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
        >
          <div className="flex items-start space-x-3 max-w-md">
            {i % 2 === 0 && (
              <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
            )}
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SkeletonStats() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div className="h-8 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="h-16 w-16 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  );
}

export function LoadingSkeleton({
  type = "card",
  count = 1,
}: LoadingSkeletonProps) {
  const skeletons = {
    card: <SkeletonCard />,
    table: <SkeletonTable />,
    chat: <SkeletonChat />,
    stats: <SkeletonStats />,
  };

  if (type === "card" || type === "stats") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(count)].map((_, i) => (
          <div key={i}>{skeletons[type]}</div>
        ))}
      </div>
    );
  }

  return <>{skeletons[type]}</>;
}
