export const calculateTotalCashAndBank = (data) => {
    let totalCash = 0;
    let totalBank = 0;

    for (let date in data) {
        totalCash += data[date].cash;
        totalBank += data[date].bank;
    }
    return {
        totalCash,
        totalBank,
        total: totalBank + totalCash,
    };
};

export const calculateTotalMyInvoices = (myInvoiceAndRevenueByDate) => {
    return Object.values(myInvoiceAndRevenueByDate).reduce((total, dayData) => {
        return total + (dayData.totalInvoices || 0);
    }, 0);
};
