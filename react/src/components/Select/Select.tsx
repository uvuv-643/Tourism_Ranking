import React, {ReactNode} from 'react'

interface SelectOption {
    id: string,
    label: string
}

type SelectProps = {
    id ?: string,
    values: SelectOption[],
    label ?: string
}

const Select = ({ id, values, label }: SelectProps) => {

    return (
        <div className="Select">
            <select name={id} id={id}>
                { values.map(el => {
                    return (
                        <>
                            <option value={el.id}>{ el.label }</option>
                        </>
                    )
                }) }
            </select>
        </div>
    )

}

export default Select