const fmtDate = (iso) =>{
    return new Date(iso).toLocaleString(undefined, { hour12: false, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}
export default fmtDate;