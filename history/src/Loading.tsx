import { useEffect, useRef } from "react";

const Loading = ({ onVisible }: { onVisible: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const element = ref.current;
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          onVisible();
        }
      });
      observer.observe(element);

      return () => observer.unobserve(element);
    }
  }, [ref.current, onVisible]);

  return (
    <div
      ref={ref}
      style={{
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      Loading...
    </div>
  );
};

export default Loading;
