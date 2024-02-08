import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { forwardRef } from 'react';
import { Perfume } from "types";

const Sticker: any = forwardRef(function Sticker(props: Perfume, ref) {
    const perfume = props;

    return (
        <div key={perfume.name || perfume.brand} className="w-full md:w-1/3 px-2 mb-4 animate-pop-in"   >
            <div className="bg-white p-6 flex items-center flex-col">
                <div className='flex justify-between w-full'>
                    <h3 className="text-xl font-semibold mb-4 line-clamp-1">{perfume.name}</h3>
                    {process.env.NEXT_PUBLIC_COHERE_CONFIGURED && perfume._additional.generate.error != "connection to Cohere API failed with status: 429" && (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button className='rounded-full p-2 bg-black cursor-pointer w-10 h-10'>✨</Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 h-80 overflow-auto">
                                <div>
                                    <p className='text-2xl font-bold'>Why you&apos;ll like this perfume:</p>
                                    <br />
                                    <p>{perfume._additional.generate.singleResult}</p>
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}

                </div>
                <div className='w-48 h-72'>
                    <img
                        src={perfume.image}
                        alt={"Thumbnail of the perfume " + perfume.name}
                        className="w-full h-full rounded-lg shadow-lg"
                    />
                </div>
                <p className="mt-4 text-gray-500 line-clamp-1">{perfume.brand}</p>
                <div className='flex'>
                    <Button className="bg-black text-white w-full rounded-md hover:bg-gray-800 hover:text-white" type="submit" variant="outline" onClick={() => { openModal(perfume.name) }}>
                        Learn More
                    </Button>
                </div>
            </div>
        </div>
    );
});

export { Sticker };