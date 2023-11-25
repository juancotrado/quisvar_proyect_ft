import { Feedback, Level, RangeDays } from '../types/types';

export const findProject = (data: Level[]): boolean => {
  let existProyect = false;
  for (const el of data) {
    if (existProyect) return true;
    existProyect = el.isProject;
    if (!existProyect && el.nextLevel) {
      existProyect = findProject(el.nextLevel);
    }
  }
  return existProyect;
};

export const deleteExtension = (fileName: string) =>
  fileName.split('.').slice(0, -1).join();
export const getFirstLetterNames = (firstName: string, lastName: string) => {
  const firstLetterFirstName = firstName[0].toUpperCase();
  const firstLetterLastName = lastName[0].toUpperCase();
  return firstLetterFirstName + firstLetterLastName;
};

export const getIconDefault = (seed: string) => {
  const urlIconDefault = `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${seed}&rotate=10&backgroundColor=00897b,00acc1,039be5,1e88e5,3949ab,43a047,546e7a,5e35b1,6d4c41,757575,7cb342,8e24aa,c0ca33,d81b60,e53935,f4511e,fb8c00,fdd835,ffb300,ffdfbf&eyes=bulging,dizzy,eva,frame1,frame2,glow,happy,robocop,round,roundFrame01,roundFrame02,sensor,shade01`;
  // const urlIconDefault = `https://robohash.org/${seed}`;//robohash
  return urlIconDefault;
};

export const generateUniqueColorForDNI = (dni: string) => {
  const valorNumber = parseInt(dni, 10);

  const r = (valorNumber * 17) % 256;
  const g = (valorNumber * 29) % 256;
  const b = (valorNumber * 41) % 256;

  const hexadecimalColo = `#${r.toString(16).padStart(2, '0')}${g
    .toString(16)
    .padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

  return hexadecimalColo;
};

export const getDayDiferency = (firsDate: string, lastDate: string) => {
  const untilDateTime =
    new Date(lastDate).getTime() - new Date(firsDate).getTime();
  const transformToDays =
    Math.floor((untilDateTime / 1000 / 60 / 60 / 24) * 10) / 10;
  return transformToDays;
};
export const getDaysHistory = (
  feedBacks: Feedback[],
  assignedAt: string
): RangeDays[] => {
  const dayEmployee = getDayDiferency(assignedAt, feedBacks[0].createdAt);
  const result = [{ participant: 'E', day: dayEmployee }];
  for (const i in feedBacks) {
    const dayCoordinator = getDayDiferency(
      feedBacks[i].createdAt,
      feedBacks[i].updatedAt
    );
    result.push({ participant: 'C', day: dayCoordinator });
    if (!feedBacks[+i + 1]) continue;
    const dayEmployee = getDayDiferency(
      feedBacks[i].updatedAt,
      feedBacks[+i + 1].createdAt
    );
    result.push({ participant: 'E', day: dayEmployee });
  }
  console.log('ASD', JSON.stringify(result, null, 2));
  return result;
};

export const transformDays = (days: number[]) => {
  const sumDays = days.reduce((acc, day) => +(acc + day).toFixed(1), 0);
  if (sumDays <= 1) return [days];
  const result = [];
  for (let i = 0; i < days.length; i++) {
    const intDay = Math.trunc(days[i]);
    const floatDay = +(days[i] - intDay).toFixed(1);
    for (let i = 0; i < intDay; i++) {
      result.push(1);
    }
    if (floatDay > 0) {
      const nextValurArr = days[i + 1];
      const floatDays = [floatDay];
      let sumFloatDay;

      if (nextValurArr) {
        if (+(floatDay + nextValurArr).toFixed(1) < 1) {
          const copyDays = [...days.slice(i + 1)];
          for (const j in copyDays) {
            sumFloatDay = floatDays.reduce(
              (acc, day) => +(acc + day).toFixed(1),
              0
            );
            if (sumFloatDay + copyDays[j] < 1) {
              floatDays.push(copyDays[j]);
              days.splice(i, 1);
            }
          }
        } else {
          days[i + 1] = +(days[i + 1] - (1 - floatDay)).toFixed(1);
          result.push([...floatDays, +(1 - floatDay).toFixed(1)]);
          continue;
        }
        if (!sumFloatDay) continue;
        days[i + 1] = +(days[i + 1] - (1 - sumFloatDay)).toFixed(1);
        const daysPushValues = days[i + 1]
          ? [...floatDays, +(1 - sumFloatDay).toFixed(1)]
          : floatDays;
        result.push(daysPushValues);
      } else {
        result.push(floatDays);
      }
    }
  }
  return result;
};

export const transformDaysObject = (days: RangeDays[]) => {
  const sumDays = days.reduce((acc, { day }) => +(acc + day).toFixed(1), 0);
  if (sumDays <= 1) return [days];
  const result = [];

  for (let i = 0; i < days.length; i++) {
    const intDay = Math.trunc(days[i].day);
    const floatDay = +(days[i].day - intDay).toFixed(1);
    for (let k = 0; k < intDay; k++) {
      result.push({ ...days[i], day: 1 });
    }
    if (floatDay > 0) {
      const floatDays = [{ ...days[i], day: floatDay }];
      const nextValurArr = days[i + 1]?.day;
      let sumFloatDay;

      if (nextValurArr) {
        if (+(floatDay + nextValurArr).toFixed(1) < 1) {
          const copyDays = [...days.slice(i + 1)];
          for (const j in copyDays) {
            sumFloatDay = floatDays.reduce(
              (acc, { day }) => +(acc + day).toFixed(1),
              0
            );
            if (sumFloatDay + copyDays[j].day < 1) {
              console.log(sumFloatDay, copyDays[j].day);
              floatDays.push({ ...copyDays[j], day: copyDays[j].day });
              days.splice(i, 1);
            }
          }
        } else {
          days[i + 1] = {
            ...days[i + 1],
            day: +(days[i + 1].day - (1 - floatDay)).toFixed(1),
          };

          result.push([
            ...floatDays,
            { ...days[i + 1], day: +(1 - floatDay).toFixed(1) },
          ]);
          continue;
        }
        if (!sumFloatDay) continue;
        days[i + 1] = {
          ...days[i + 1],
          day: +(days[i + 1]?.day - (1 - sumFloatDay)).toFixed(1),
        };
        const daysPushValues = days[i + 1]
          ? [
              ...floatDays,
              { ...days[i + 1], day: +(1 - sumFloatDay).toFixed(1) },
            ]
          : floatDays;
        result.push(daysPushValues);
      } else {
        result.push(...floatDays);
      }
    }
  }
  return result;
};

export const drawDaysBars = (data: (RangeDays | RangeDays[])[]) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const width = 600;
  canvas.width = width * data.length;
  const height = 100;

  const drawBar = (x: number, day: number, participant: string) => {
    if (!ctx) return;
    const color = participant === 'E' ? '#92D268' : '#FFC700';
    const width1 = day * width;
    ctx.fillStyle = color;
    ctx.fillRect(x, 0, width1, height);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, 0, width1, height);
    ctx.fillStyle = 'black';
    ctx.font = 'bold 35px Arial';

    ctx.textAlign = 'center';
    ctx.fillText(day.toString(), x + width1 / 2, height / 1.5);
  };
  function drawCompoundBar(x: number, subBars: RangeDays[]) {
    subBars.forEach(subBar => {
      const width1 = subBar.day * width;
      drawBar(x, subBar.day, subBar.participant);
      x += width1;
    });
  }

  let x = 0;

  data.forEach(item => {
    if (Array.isArray(item)) {
      drawCompoundBar(x, item);
    } else {
      drawBar(x, item.day, item.participant);
    }
    x += 1 * width;
  });
  const myBase64Image = canvas.toDataURL('image/png'); // 'image/png' es el formato de la imagen

  console.log(myBase64Image);
  return myBase64Image;
};
