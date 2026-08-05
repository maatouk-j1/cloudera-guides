interface PostBannerProps {
  type: string
  children: React.ReactNode
}

export default function PostBanner({ type, ...props }: PostBannerProps) {

  const typeIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return (
          <svg className="fill-yellow-500 shrink-0 mr-4" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M8.864 1.496a1 1 0 0 0-1.728 0L.14 13.5A1 1 0 0 0 1.004 15h13.992a1 1 0 0 0 .864-1.504L8.864 1.496ZM7 6h2v4H7V6Zm0 5h2v2H7v-2Z" />
          </svg>
        );
      case 'important':
        return (
          <svg className="fill-red-500 shrink-0 mr-4" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.69 0 0 4.69v6.62L4.69 16h6.62L16 11.31V4.69L11.31 0H4.69Zm3.31 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1Zm1-3H7V4h2v5Z" />
          </svg>
        );
      case 'info':
      default:
        return (
          <svg className="fill-blue-500 shrink-0 mr-4" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8Zm0 6c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1Zm1 6H7V7h2v5Z" />
          </svg>
        )
    }
  }

  return (
    <div className="text-sm p-4 bg-stone-50 border border-stone-200 rounded-sm dark:bg-stone-900 dark:border-stone-700">
      <div className="flex items-center">
        {typeIcon(type)}
        <div>
          {props.children}
        </div>
      </div>
    </div>
  )
}