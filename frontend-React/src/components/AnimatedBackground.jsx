const AnimatedBackground = () => {
  const floatingCircles = [
    { size: 'w-[300px] h-[300px]', position: 'top-[-150px] left-[-150px]', duration: '20s' },
    { size: 'w-[200px] h-[200px]', position: 'top-[50%] right-[-100px]', duration: '18s', delay: '2s' },
    { size: 'w-[250px] h-[250px]', position: 'bottom-[-125px] left-[30%]', duration: '22s', delay: '4s' },
    { size: 'w-[150px] h-[150px]', position: 'top-[20%] left-[10%]', duration: '16s', delay: '1s' },
    { size: 'w-[180px] h-[180px]', position: 'bottom-[20%] right-[20%]', duration: '19s', delay: '3s' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {floatingCircles.map(({ size, position, duration, delay }, index) => (
        <div
          key={`circle-${index}`}
          className={`absolute ${size} ${position} rounded-full bg-gradient-to-br from-primary-400/10 to-primary-200/5 animate-float-slow`}
          style={{
            animationDuration: duration,
            animationDelay: delay || '0s',
          }}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-transparent to-primary-50/30" />
    </div>
  );
};

export default AnimatedBackground;