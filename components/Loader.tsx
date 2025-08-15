
import React from 'react';

const messages = [
  "Analyzing terabytes of data...",
  "Consulting academic archives...",
  "Validating statistical models...",
  "Cross-referencing global sources...",
  "Generating insightful visualizations...",
  "Almost there, polishing the results...",
];

const Loader: React.FC = () => {
  const [message, setMessage] = React.useState(messages[0]);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setMessage(prevMessage => {
        const currentIndex = messages.indexOf(prevMessage);
        const nextIndex = (currentIndex + 1) % messages.length;
        return messages[nextIndex];
      });
    }, 2500);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full text-text-primary gap-6 p-4">
      <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      <h2 className="text-xl font-semibold">Working on it...</h2>
      <p className="text-text-secondary text-center transition-opacity duration-500">{message}</p>
    </div>
  );
};

export default Loader;
