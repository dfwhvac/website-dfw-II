import NextImage from 'next/image'
import { cn } from '../../lib/utils'

const Image = ({ className, alt = '', ...props }) => {
  return (
    <NextImage
      className={cn('', className)}
      alt={alt}
      {...props}
    />
  )
}

Image.displayName = 'Image'

export { Image }