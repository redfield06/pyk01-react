export default function PayLogo({ m, size = 'md' }) {
    if (m.logo) {
        return <img className={`plogo-img ${size}`} src={m.logo} alt={m.name} />
    }
    return (
        <span className={`plogo ${size}`} style={{ background: m.color, color: m.text || '#fff' }}>
            {m.short}
        </span>
    )
}