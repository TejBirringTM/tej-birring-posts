import { Title } from "./_content/typography";
import Pen from "@/app/_ui/_assets/_svgs/pen-circle.svg"

export default function TheHeader() {
    return (
        <header className="flex flex-row items-center justify-center sm:justify-between">
            <div className="py-6 px-3">
                <Title className="text-ecru fill-ecru">
                    <Pen className="hidden sm:inline-block size-14 mr-4 -mt-4" />
                    Tej Birring
                </Title>
                <p className="relative sm:block text-paper font-medium sm:ml-[4.7rem] -mt-0.5 -z-10 text-center sm:text-left">Lorem ipsum...</p>
            </div>
          
        </header>
    )
}
