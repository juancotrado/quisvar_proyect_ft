import { CSSProperties } from 'react';
import { getIconDefault } from '../../utils';
import './iconProfile.css';

interface IconProfileProps {
  dni: string;
  size?: number;
}

const IconProfile = ({ dni, size = 2 }: IconProfileProps) => {
  const style: CSSProperties = {
    width: `${size}rem`,
    height: `${size}rem`,
  };
  return (
    <figure className="iconProfile-profile-figure" style={style}>
      <img src={getIconDefault(dni)} alt={dni} />
    </figure>
  );
};

export default IconProfile;
