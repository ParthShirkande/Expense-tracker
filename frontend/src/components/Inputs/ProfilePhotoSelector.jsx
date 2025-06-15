import { useState } from "react"
import React, { useRef } from 'react'
import {LuUser,LuUpload,LuTrash} from 'react-icons/lu'

const ProfilePhotoSelector = ({image,setImage}) => {
    const inputRef = useRef(null)
    const [previewUrl, setPreviewUrl] = useState(null)

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImage(file)
            const preview = URL.createObjectURL(file)
            setPreviewUrl(preview)
        }
    }
    const handleRemoveImage = () => {   
        setImage(null)
        setPreviewUrl(null)
        if (inputRef.current) {
            inputRef.current.value = null
        }
    }
    const onChooseFile=()=>{
        if (inputRef.current) {
            inputRef.current.click()
        }
    }

  return (
    <div className="flex justify-center mb-6">
        <input
            type="file"
            accept="image/*"
            ref={inputRef}
            onChange={handleImageChange}
            className="hidden"
        />
        {!image ? (
            <div className="w-20 h-20 flex items-center justify-center bg-purple-100 rounded-full relative">
                <LuUser className="text-4xl text-primary"/>
                <button
                    type="button"
                    onClick={onChooseFile}
                    className="w-8 h-8 items-center justify-center bg-primary text-white rounded-full absolute -right-1 -bottom-1 "
                >
                <LuUpload className="ml-2" />
                </button>
            </div>
        ) : (
            <div className="relative">
                <img
                    src={previewUrl}
                    alt="Profile Photo"
                    className="w-20 h-20 rounded-full  object-cover object-top"
                />
                <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute bottom-0 right-0 bg-red-500 text-white rounded-full p-1"
                >
                    <LuTrash />
                </button>
            </div>
        )}
    </div>
  )
}

export default ProfilePhotoSelector
