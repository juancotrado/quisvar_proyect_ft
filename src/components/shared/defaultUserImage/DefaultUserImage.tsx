import { Users } from '../../../types/types';
import { getFirstLetterNames } from '../../../utils/tools';
import colors from '../../../utils/json/colors.json';

import './defaultUserImage.css';
import { useMemo, useState } from 'react';

interface DefaultUserImageProps {
  user: Users;
}

const DefaultUserImage = ({ user }: DefaultUserImageProps) => {
  const { firstName, lastName } = user.user.profile;
  const [message, setMenssage] = useState(false);
  const showMessage = () => setMenssage(true);
  const hiddenMessage = () => setMenssage(false);
  const fistLetterNames = getFirstLetterNames(firstName, lastName);
  const color = useMemo(() => colors[Math.floor(Math.random() * 11) + 1], []);
  const style = {
    backgroundColor: color || 'blue',
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
