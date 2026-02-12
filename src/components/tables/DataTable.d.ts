import * as React from "react";
interface Column<T> {
    key: string;
    header: string;
    render?: (item: T) => React.ReactNode;
    className?: string;
}
interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    keyExtractor: (item: T) => string | number;
    emptyMessage?: string;
    className?: string;
}
export declare function DataTable<T>({ data, columns, keyExtractor, emptyMessage, className, }: DataTableProps<T>): import("react/jsx-runtime").JSX.Element;
export {};
