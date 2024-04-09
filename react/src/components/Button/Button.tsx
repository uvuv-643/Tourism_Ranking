import React from 'react'

type ButtonProps = {
    children: React.ReactNode,
    onClick?: () => void,
    small?: boolean
    secondary?: boolean
}

const Button = ({children, onClick, small, secondary}: ButtonProps) => {

    return (
        <div className={"Button" + (small ? " _small" : '') + (secondary ? " _secondary" : '')} onClick={onClick}>
            {children}
        </div>
    )

}

export default Button
