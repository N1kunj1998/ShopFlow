// Quick test script to verify image URLs work
const testUrls = [
  'https://picsum.photos/seed/123/400/400',
  'https://picsum.photos/400/400',
  'https://via.placeholder.com/400x400',
]

console.log('Testing image URLs:')
testUrls.forEach((url, i) => {
  console.log(`${i + 1}. ${url}`)
})

