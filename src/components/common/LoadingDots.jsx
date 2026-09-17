import { motion } from "framer-motion";
import React from "react";

export default function LoadingDots({
  title = null,
  subtitle = null,
  numberOfDots = 3,
  dotSize = 15,
  bounceHeight = 10,
  duration = 0.5, // seconds
  containerStyle = "",
  dotContainerStyle = "",
  dotColor = "", // fallback color if no dotClassName
  dotClassName = "", // new: Tailwind gradient classes
}) {
  const getDotStyle = () => ({
    width: dotSize,
    height: dotSize,
    borderRadius: "9999px", // fully rounded
    backgroundColor: !dotClassName && dotColor ? dotColor : undefined,
  });

  return (
    <div
      role="status"
      aria-label="Loading indicator"
      className={`flex flex-col justify-center items-center px-6 w-full h-full ${containerStyle}`}
    >
      <div className={`flex flex-row gap-2 mb-4 ${dotContainerStyle}`}>
        {Array.from({ length: numberOfDots }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0.2, y: 0 }}
            animate={{ opacity: 1, y: -bounceHeight }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              delay: index * 0.1,
              duration,
              ease: "easeInOut",
            }}
            className={dotClassName}
            style={getDotStyle()}
          />
        ))}
      </div>

      {title && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-lg font-medium text-center text-gray-800 mb-2">
            {title}
          </p>
        </motion.div>
      )}

      {subtitle && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p className="text-base text-center text-gray-500">{subtitle}</p>
        </motion.div>
      )}
    </div>
  );
}
