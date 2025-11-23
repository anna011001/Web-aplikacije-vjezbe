export function brojDana(startDate, endDate) {
    const leaseStart = new Date(startDate);
    const leaseEnd = new Date(endDate);

    let razlika_u_ms = leaseEnd - leaseStart;
    let razlika_u_danima = razlika_u_ms / 1000 / 60 / 60 / 24;

    return razlika_u_danima;
};