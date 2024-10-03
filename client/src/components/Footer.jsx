import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import { BsFacebook, BsInstagram, BsTwitterX, BsGithub, BsGoogle } from "react-icons/bs"

export default function FooterCom() {
  return (
    <Footer container className="border border-t-8 border-teal-500">
        <div className="w-full max-w-7xl mx-auto">
            <div className="grid w-full justify-between sm:flex md:grid-cols-1">
                <div className="mt-5">
                    <Link to="/" className="self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white">
                        <span className="p-2 bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 rounded-lg text-white">Zakuro&apos;s</span>
                        Blog
                    </Link>
                </div>

                <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
                    <div className="">
                        <Footer.Title title="About" />
                        <Footer.LinkGroup col>
                            <Footer.Link href="https://www.100jsprojects.com" target="_blank" rel="noopener noreferrer">
                                100JS Project
                            </Footer.Link>

                            <Footer.Link href="/about" target="_blank" rel="noopener noreferrer">
                                Zakuro&apos;s Blog
                            </Footer.Link>
                        </Footer.LinkGroup>
                    </div>
                    
                    <div className="">
                        <Footer.Title title="Follow us" />
                        <Footer.LinkGroup col>
                            <Footer.Link href="#" target="_blank" rel="noopener noreferrer">
                                GitHub
                            </Footer.Link>

                            <Footer.Link href="#" target="_blank" rel="noopener noreferrer">
                                Discord
                            </Footer.Link>
                        </Footer.LinkGroup>
                    </div>

                    <div className="">
                        <Footer.Title title="Legal" />
                        <Footer.LinkGroup col>
                            <Footer.Link href="#">
                                Privacy
                            </Footer.Link>

                            <Footer.Link href="#" target="_blank" rel="noopener noreferrer">
                                Term &amp; Conditions
                            </Footer.Link>
                        </Footer.LinkGroup>
                    </div>
                </div>
            </div>
            <Footer.Divider />
            <div className="w-full sm:flex sm:items-center sm:justify-between">
                <Footer.Copyright href="#" by="Zakuro's blog" year={new Date().getFullYear()}/>
                <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
                    <Footer.Icon href="#" icon={BsFacebook}/>
                    <Footer.Icon href="#" icon={BsInstagram}/>
                    <Footer.Icon href="#" icon={BsTwitterX}/>
                    <Footer.Icon href="#" icon={BsGithub}/>
                    <Footer.Icon href="#" icon={BsGoogle}/>
                </div>
            </div>
        </div>
    </Footer>
  )
}
