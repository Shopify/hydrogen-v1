interface Item {
    key: string;
    value: string;
}
interface TableProps {
    items: Item[];
}
export declare function Table({ items }: TableProps): JSX.Element;
export {};
