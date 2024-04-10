import React, {useEffect, useState} from 'react'

type HistogramProps = {
    values: {label: string, prob: number}[],
    title?: string
}

const Histogram = ({ values, title } : HistogramProps) => {

    const [hovered, setHovered] = useState<boolean[]>([])

    const handleHover = (index: number, hover: boolean) => {
        let hoveredCopy = [...new Array(values.length)].map(_ => false)
        hoveredCopy[index] = hover
        console.log(hoveredCopy)
        setHovered(hoveredCopy)
    }

    return (
        <div className="Histogram">
            { title && <h3>{ title }</h3> }
            <div className="Histogram__Hints">
                {values.map((el, index) => (
                    <div className="Histogram__Hints__Item"
                         onMouseEnter={() => handleHover(index, true)}
                         onMouseLeave={() => handleHover(index, false)}
                         style={{
                             left: index < values.length / 2 ? (index + 0.5) * 100 / values.length + '%' : 'auto',
                             right: index >= values.length / 2 ? (values.length - index - 0.5) * 100 / values.length + '%' : 'auto',
                             bottom: 0.5 * 100 * el.prob / Math.max(...values.map(el => el.prob)) + '%',
                             display: hovered[index] ? 'block' : 'none'
                         }}>
                        <h4> {el.label}</h4>
                    </div>
                ))}
            </div>
            <div className="Histogram__Bars">
                {values.map((el, index) => {
                    let bgColor = (el.prob / Math.max(...values.map(el => el.prob)) + 0.4) / 1.3
                    return (
                        <div className="Histogram__Bars__Item"
                             onMouseEnter={() => handleHover(index, true)}
                             onMouseLeave={() => handleHover(index, false)}
                             style={{
                                 height: 100 * el.prob / Math.max(...values.map(el => el.prob)) + '%',
                                 width: 100 / values.length + '%',
                                 background: 'rgba(229, 197, 132, ' + bgColor + ')'
                             }}></div>

                    )
                })}
            </div>

            <div className="Histogram__Labels">
                {values.map((el) => (
                    <div className="Histogram__Labels__Item"
                         style={{
                             width: 100 / values.length + '%',
                         }}
                    >{values.length < 10 ? el.label : '...'}</div>
                ))}
            </div>
        </div>
    )

}

export default Histogram