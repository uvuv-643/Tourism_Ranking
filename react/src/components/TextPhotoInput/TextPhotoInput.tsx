import React, {useEffect, useState} from 'react'
import TextInput from "../TextInput/TextInput";
import ImageUpload from "../ImageUpload/ImageUpload";

type TextPhotoInputProps = {
    onChange: (value: string) => void
    onChangeMode: (value: boolean) => void
}

const TextPhotoInput = ({ onChange, onChangeMode }: TextPhotoInputProps) => {

    const [photoModeEnabled, setPhotoModeEnabled] = useState<boolean>(false)
    const [textQuery, setTextQuery] = useState<string>("")

    useEffect(() => {
        onChange(textQuery)
    }, [textQuery])

    useEffect(() => {
        onChangeMode(photoModeEnabled)
    }, [photoModeEnabled])

    return (
        <div className="TextPhotoInput">
            {
                photoModeEnabled ? (
                    <ImageUpload
                        id="image-upload"
                        onChange={setTextQuery}
                        handleTextMode={() => setPhotoModeEnabled(false)}
                    />
                ) : (
                    <TextInput
                        onChange={setTextQuery}
                        handlePhotoMode={() => setPhotoModeEnabled(true)}
                    />
                )
            }

        </div>
    )

}

export default TextPhotoInput