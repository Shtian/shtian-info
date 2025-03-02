export const Stars = () => {
  return (
    <>
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="size-[2px] fixed rounded-full bg-gray-400 dark:bg-white animate-twinkle"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}
    </>
  );
};
