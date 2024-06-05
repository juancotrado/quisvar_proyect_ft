export type GroupReq = {
  id: number;
};
export type PdfInfoProps = {
  title?: string;
  group?: string;
  mod?: string;
  createdAt?: string;
};
export type ProjectList = {
  id: number;
  cui: string;
  projectName?: string;
};
export type Nav = {
  to: string;
  imgSrc: string;
  imgAlt: string;
  title: string;
};
