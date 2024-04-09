import React from 'react'

type InputProps = {
    onChange: (value: string) => void,
    label: string,
    placeholder ?: string,
    id ?: string,
}

const Input = ({ label, placeholder, onChange, id } : InputProps) => {

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value)
    }

    return (
        <div className="Input">
            <input type="text" id={id} name={id} onChange={handleInputChange} placeholder={placeholder}/>
        </div>
    )

}

export default Input
