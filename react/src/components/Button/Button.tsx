import React from 'react'

type ButtonProps = {
    children: React.ReactNode,
    onClick: () => void,
}

const Button = ({ children, onClick } : ButtonProps) => {

    return (
        <button className="Button" onClick={onClick}>
            { children }
        </button>
    )

}

export default Button
