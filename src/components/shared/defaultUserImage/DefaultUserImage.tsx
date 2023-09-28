import { Users } from '../../../types/types';
import { getFirstLetterNames } from '../../../utils/tools';
import colors from '../../../utils/json/colors.json';

import './defaultUserImage.css';
import { useEffect, useRef, useState } from 'react';

interface DefaultUserImageProps {
  user: Users;
}
const DefaultUserImage = ({ user }: DefaultUserImageProps) => {
  const { firstName, lastName } = user.user.profile;
  const colorRef = useRef<string | null>(null);
  const [message, setMenssage] = useState(false);
  useEffect(() => {
    colorRef.current = colors[Math.floor(Math.random() * 11) + 1];
  }, []);

  const showMessage = () => setMenssage(true);
  const hiddenMessage = () => setMenssage(false);
  const fistLetterNames = getFirstLetterNames(firstName, lastName);
  const style = {
    backgroundColor: colorRef.current || 'blue',
  };
  return (
    <div className="defaultUserImage-contain">
      <div
        className="defaultUserImage"
        style={style}
        onMouseEnter={showMessage}
        onMouseLeave={hiddenMessage}
      >
        {fistLetterNames}
      </div>
      {message && (
        <span className="defaultUserImage-message">
          {firstName} {lastName}
        </span>
      )}
    </div>
  );
};

export default DefaultUserImage;
