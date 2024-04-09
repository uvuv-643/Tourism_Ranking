import React, {useEffect, useState} from 'react';
import Button from "../Button/Button";
import {FaUpload} from "react-icons/fa6";

type InputProps = {
    id: string,
    handleTextMode: () => void,
    onChange: (value: string) => void,
}

const ImageUpload = ({id, handleTextMode, onChange}: InputProps) => {

    const [selectedImage, setSelectedImage] = useState<string>('');

    useEffect(() => {
        onChange(selectedImage)
    }, [selectedImage])

    const handleImageChange = (event: React.ChangeEvent<any>) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) {
                    if (typeof reader.result !== 'string') {
                        setSelectedImage(new TextDecoder().decode(reader.result))
                    } else {
                        setSelectedImage(reader.result)
                    }
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = () => {
        if (selectedImage) {
            // Send selectedImage to server
            console.log('Uploading image:', selectedImage);
        } else {
            console.log('No image selected.');
        }
    };

    return (
        <div className="ImageUpload">
            <div className={"ImageUpload__Input" + (!selectedImage ? " _flex" : "")}>
                <input
                    type="file"
                    id={id}
                    name={id}
                    accept="image/*"
                    onChange={handleImageChange}
                />
                <label htmlFor={id}>
                    <Button small>Загрузить фото <FaUpload/></Button>
                </label>

                <div className="ImageUpload__Back" onClick={handleTextMode}>
                    <Button small secondary>Ввести текстом</Button>
                </div>

            </div>
            {selectedImage && (
                <div className="ImageUpload__Preview">
                    <img src={selectedImage} alt="Что-то пошло не так, обновите страницу"/>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
