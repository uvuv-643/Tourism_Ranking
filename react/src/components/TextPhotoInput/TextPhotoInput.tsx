import React, {useState} from 'react'
import TextInput from "../TextInput/TextInput";
import ImageUpload from "../ImageUpload/ImageUpload";

const TextPhotoInput = () => {

    const [photoModeEnabled, setPhotoModeEnabled] = useState<boolean>(false)
    const [textQuery, setTextQuery] = useState<string>("")

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