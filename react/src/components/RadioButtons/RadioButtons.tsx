import React from 'react'

interface RadioOption {
    id: string,
    label: string
}

type RadioProps = {
    id?: string,
    values: RadioOption[],
    label?: string
}


const RadioButtons = ({id, values, label}: RadioProps) => {

    return (
        <div className="RadioButtons">
            <p>{label}</p>
            <div className="RadioButtons__Buttons">
                {values.map(el => {
                    return (
                        <div key={el.id}>
                            <input type="radio" name={id} value={el.id} id={el.id}/>
                            <label htmlFor={el.id}>{el.label}</label>
                        </div>
                    )
                })}
            </div>
        </div>
    )

}

export default RadioButtons
