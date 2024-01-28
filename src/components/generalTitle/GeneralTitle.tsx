interface GeneralTitleProps {
  firstTitle: string;
  secondTitle: string;
}

const GeneralTitle = ({ firstTitle, secondTitle }: GeneralTitleProps) => {
  return (
    <h1 className="main-title">
      {firstTitle} <span className="main-title-span">{secondTitle} </span>
    </h1>
  );
};

export default GeneralTitle;
