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

export interface ModalFormProps {
  id?: string;
  isOpen: boolean;
  onOpen: () => void;
}

export interface Item {
  id:   string;
  name: string;
}