import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Button } from "@radix-ui/themes";
import { SyntheticEvent, useState } from "react";
import { CircleLoader } from "react-spinners";
import { Perfume } from "types";

export default function SearchPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchQueryResults, setSearchQueryResults] = useState([]);
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [searchLoadedOnce, setSearchLoadedOnce] = useState(false);

    const getPerfumes = async (e: SyntheticEvent) => {
        e.preventDefault();

        // Check Inputs
        if (searchQuery === '') {
            alert("Please input the name of the perfume");
            return;
        }

        setIsSearchLoading(true);

        await fetch('/api/searchName', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: searchQuery,
            })
        })
            .then((res) => {
                console.log(res)
                if (res.ok) return res.json();
            })
            .then((results) => {
                console.log(results.data.Get.Perfume);
                setSearchQueryResults(results.data.Get.Perfume);
            });

        setIsSearchLoading(false);
        setSearchLoadedOnce(true);
    };

    return (
        <div className="h-screen flex flex-col justify-between bg-gray-100">
            <form
                id="recommendation-form"
                className="mb-10"
                onSubmit={getPerfumes}
            >
                <Input
                    type="text"
                    id="fav-perfume-search"
                    name="fav-perfume"
                    placeholder="search"
                    className="block w-full px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm "
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                    }}
                />
            </form>


            {isSearchLoading ? (
                <div className="w-full flex justify-center h-60 pt-10">
                    <CircleLoader
                        color={'#000000'}
                        loading={isSearchLoading}
                        size={100}
                        aria-label="Loading"
                        data-testid="loader"
                    />
                </div>
            ) : (
                <>
                    {searchLoadedOnce ? (
                        <>
                            <h2 className="text-2xl font-bold mb-4 text-center">
                                Recommended Perfumes
                            </h2>
                            <div
                                id="recommended-perfumes"
                                className="flex overflow-x-scroll pb-10 hide-scroll-bar"
                            >
                                {/* <!-- Recommended perfumes dynamically added here --> */}
                                <section className="container mx-auto mb-12">
                                    <div className="flex flex-wrap -mx-2">
                                        {searchQueryResults.map((perfume: Perfume) => {
                                            return (
                                                <div key={perfume.name || perfume.brand} className="w-full md:w-1/3 px-2 mb-4 animate-pop-in">
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
                                                        {/* <div className='flex'>
                                                            <Button className="bg-black text-white w-full rounded-md hover:bg-gray-800 hover:text-white" type="submit" variant="outline" onClick={() => { openModal(perfume.name) }}>
                                                                Learn More
                                                            </Button>
                                                        </div> */}
                                                    </div>
                                                </div>

                                            );
                                        })}
                                    </div>
                                </section>
                            </div>
                        </>
                    ) : (
                        <div className="w-full flex justify-center h-60 pt-10"></div>
                    )}

                </>
            )}
        </div>
    );
}