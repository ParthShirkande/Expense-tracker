import React from 'react'
import { getInitials } from '../../utils/helper'

const CharAvatar = ({fullName,width,height,styles}) => {
  return (
    <div className={`${width || 'w-12'} ${height || 'h-12'} rounded-full bg-gray-100 text-gray-900 font-medium flex items-center justify-center ${styles || ''}`}>
      {getInitials(fullName || "")}
    </div>
  )
}

export default CharAvatar
