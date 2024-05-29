function formattedDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // С учетом того, что месяцы нумеруются с 0
    const day = String(date.getDate()).padStart(2, '0');

    const form_date = `${year}-${month}-${day}`;
    return form_date;
}

export default formattedDate;
