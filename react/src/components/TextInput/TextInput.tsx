import React from 'react'
import Input from "../Input/Input";
import {FaCamera} from "react-icons/fa6";

type TextInputProps = {
    handlePhotoMode: () => void,
    onChange: (value: string) => void
}

const TextInput = ({handlePhotoMode, onChange}: TextInputProps) => {

    return (
        <div className="TextInput">
            <Input onChange={onChange} label="Введите ваш запрос" placeholder="Нижегородский Кремль" />
            <div className="TextInput__Camera" onClick={handlePhotoMode}>
                <FaCamera/>
            </div>
        </div>
    )

}

export default TextInput
