export const dateToString = (date) => {
    // Chuyển đổi đối tượng Date thành chuỗi
    const d = new Date(date);

    // Lấy ngày, tháng, năm
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    // Trả về chuỗi theo định dạng DD/MM/YYYY
    return `${day}/${month}/${year}`;
};