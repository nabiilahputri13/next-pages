'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import React from 'react'

type BackButtonProps = {
  label?: string
  iconSrc?: string
  className?: string
}

const BackButton: React.FC<BackButtonProps> = ({
  label = 'Back',
  iconSrc = '/icons/back-button.png',
  className = '',
}) => {
  const router = useRouter()

  return (
    <button
      onClick={() => router.back()}
      className={`flex items-center text-black hover:underline ${className}`}
    >
      <Image
        src={iconSrc}
        alt="Back"
        width={20}
        height={20}
        className="mr-2"
      />
      {label}
    </button>
  )
}

export default BackButton
