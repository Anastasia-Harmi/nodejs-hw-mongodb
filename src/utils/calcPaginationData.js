export const calcPaginationData = ({totalItems, page, perPage}) => {
const totalPages = Math.ceil(totalItems/perPage); //ск всього стр;
const hasNextPage = page < totalPages; // true-наступна сторінка є;
const hasPrevPage = page > 1; // чи є попередня стр, можна записати і як page!==1

return {
    page,
    perPage,
    totalItems,
    totalPages,
    hasNextPage,
    hasPrevPage,
};
};
