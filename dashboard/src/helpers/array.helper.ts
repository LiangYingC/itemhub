export const ArrayHelpers = {
    FilterDuplicatedString: (array: string[]) => {
        return [...new Set(array)];
    },
};
