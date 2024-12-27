import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export enum ModalTarget {"VIEW", "INSERT", "EDIT", "DELETE"}

export interface DetailsPageProps {
  id: string;
  isOpen: boolean;
  onOpen: () => void;
}
