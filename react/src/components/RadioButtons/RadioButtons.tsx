import React from 'react'

interface RadioOption {
    id: string,
    label: string
}

type RadioProps = {
    id?: string,
    values: RadioOption[],
    label?: string,
    onChange: (v: string) => void
}


const RadioButtons = ({id, values, label, onChange}: RadioProps) => {

    return (
        <div className="RadioButtons">
            <p>{label}</p>
            <div className="RadioButtons__Buttons">
                {values.map(el => {
                    return (
                        <div key={el.id}>
                            <input type="radio" name={id} value={el.id} id={el.id} onChange={e => onChange(e.target.value)}/>
                            <label htmlFor={el.id}>{el.label}</label>
                        </div>
                    )
                })}
            </div>
        </div>
    )

}

export default RadioButtons
