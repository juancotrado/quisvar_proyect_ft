import './loader.css';

interface LoaderProps {
  isLoading: boolean;
}

const Loader = ({ isLoading }: LoaderProps) => {
  return (
    <>
      {isLoading && (
        <div className="loading">
          <span className="loader"></span>
        </div>
      )}
    </>
  );
};

export default Loader;
