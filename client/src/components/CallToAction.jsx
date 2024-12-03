import { Button } from "flowbite-react"

function CallToAction() {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
      <div className="flex-1 justify-center flex flex-col">
        <h2 className="text-2xl">Want to learn more about React JS ?</h2>
        <p className="text-gray-500 my-2">Checkout these resources with 100 ReactJS Projects</p>
        <Button gradientDuoTone='pinkToOrange' className="rounded-tl-xl rounded-bl-none">
            <a href="https://100jsprojects.com" target="_blank" rel="noopener noreferrer">100 ReactJs Projects</a>
        </Button>
      </div>
      <div className="p-7 flex-1">
        <img src="https://www.frontendmag.com/wp-content/uploads/2022/12/how-to-learn-react-js-quickly.jpeg" alt="" />
      </div>
    </div>
  )
}

export default CallToAction
