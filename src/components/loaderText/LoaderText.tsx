import './loaderText.css';
interface LoaderTextProps {
  text: string;
  className?: string;
}
const LoaderText = ({ text, className }: LoaderTextProps) => {
  return (
    <div className={`loaderText ${className}`}>
      <span className="loader-text"></span>
      <p className="loaderText-text">{text}</p>
    </div>
  );
};

export default LoaderText;
