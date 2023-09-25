import './loaderForComponent.css';
interface LoaderForComponentProps {
  width?: number;
  color?: string;
}
const LoaderForComponent = ({
  width = 60,
  color = '#001b69',
}: LoaderForComponentProps) => {
  const style = { width, aspectRatio: 1, borderBottomColor: color };
  return (
    <div className="LoaderForComponent-loading">
      <span className="LoaderForComponent-loader" style={style}></span>
    </div>
  );
};

export default LoaderForComponent;
