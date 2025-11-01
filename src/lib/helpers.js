export function getBadgeColor(category) {
  switch (category) {
    case 'Hot':
      return 'bg-red-600 text-white'
    case 'Warm':
      return 'bg-yellow-500 text-black'
    case 'Cold':
    default:
      return 'bg-gray-300 text-black'
  }
}

export function formatDate(timestamp) {
  return new Date(timestamp).toLocaleString()
}

