
import { ReactNode } from "react";

export const ListboxWrapper = ({ children }: { children: ReactNode }) => (
    <div className="w-full max-w-[315px] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
        {children}
    </div>
);