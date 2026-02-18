import React, { Suspense } from "react";
import { Skeleton } from "antd";
import { useInView } from "../hooks/useInView";

export default function LazySection({ children, height = 200 }) {
  const [ref, isVisible] = useInView();

  return (
    <div ref={ref} style={{ minHeight: height }}>
      {isVisible && (
        <Suspense fallback={<Skeleton active paragraph={{ rows: 4 }} />}>
          {children}
        </Suspense>
      )}
    </div>
  );
}
