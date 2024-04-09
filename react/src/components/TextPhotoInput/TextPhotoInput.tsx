import React, {useState} from 'react'
import TextInput from "../TextInput/TextInput";

const TextPhotoInput = () => {

    const [photoModeEnabled, setPhotoModeEnabled] = useState<boolean>(false)
    const [textQuery, setTextQuery] = useState<string>("")

    return (
        <div className="TextPhotoInput">
            <TextInput
                onChange={setTextQuery}
                handlePhotoMode={() => setPhotoModeEnabled(true)}
            />
        </div>
    )

}

export default TextPhotoInput