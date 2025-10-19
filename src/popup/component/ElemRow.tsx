import React from "react";

type Props = {
    label: string;
    labelAfter?: string;
    children: React.ReactNode;
};

export default function ElemRow({ label, labelAfter, children }: Readonly<Props>) {
    return (
        <div className="w-48 max-w-48 p-2 flex items-center">
            <label>{label}</label>
            <div className="grow ml-1" />
            {children}
            {labelAfter && <label>{labelAfter}</label>}
        </div>
    );
}