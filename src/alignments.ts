export interface Alignment {
    name: string;
    computePadding: (maxLineLength: number) => (lineLength: number) => number;
};

export const leftAlign: Alignment = {
    name: 'alignLeft',
    computePadding: (maxLineLength) => (lineLength) => lineLength,
};

export const centerAlign: Alignment = {
    name: 'alignCenter',
    computePadding: (maxLineLength) => (lineLength) => (
		Math.ceil((maxLineLength - lineLength) / 2) + lineLength
    ),
};

export const rightAlign: Alignment = {
    name: 'alignRight',
    computePadding: (maxLineLength) => (lineLength) => maxLineLength,
};
