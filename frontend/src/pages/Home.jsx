import FormUrl from "../components/FormUrl"


const Home = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to URL Shortener</h1>
      <p className="text-lg text-gray-600">
        Paste your long URL and get a short, shareable link instantly!
      </p>
      <FormUrl/>
    </div>
  )
}
export default Home