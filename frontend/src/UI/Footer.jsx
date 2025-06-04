const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-3 px-8 text-center text-base fixed bottom-0 left-0 w-full">
      &copy; {new Date().getFullYear()} URL Shortener. All rights reserved.
    </footer>
  )
}
export default Footer