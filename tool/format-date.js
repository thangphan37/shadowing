const padLeft0 = (n) => n.toString().padStart(2, '0')
const formatDate = (d) =>
  `${d.getFullYear()}-${padLeft0(d.getMonth() + 1)}-${padLeft0(d.getDate())}`

module.exports = {
  formatDate,
}
