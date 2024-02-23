import { useEffect, useRef, useState } from 'react';
import './loader.css';
import { loader$ } from '../../services/sharingSubject';
import { Subscription } from 'rxjs';

const Loader = () => {
  const [isLoader, setIsLoader] = useState<boolean>(false);

  const handleLoaderRef = useRef<Subscription>(new Subscription());

  useEffect(() => {
    handleLoaderRef.current = loader$.getSubject.subscribe((value: boolean) =>
      setIsLoader(value)
    );

    return () => {
      handleLoaderRef.current.unsubscribe();
    };
  }, []);

  return (
    <>
      {isLoader && (
        <div className="loading">
          <span className="loader"></span>
        </div>
      )}
    </>
  );
};

export default Loader;
